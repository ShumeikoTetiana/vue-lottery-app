<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import BasePagination from '@/components/BasePagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserDeleteModal from '@/components/UserDeleteModal.vue'
import UsersTable from '@/components/UsersTable.vue'
import WinnersList from '@/components/WinnersList.vue'
import { USERS_PAGE_SIZE, useUsersStore } from '@/stores/users'
import type { User, UserSortKey } from '@/types/user'
import { parseUsersQuery, toRouteQuery, type UsersListQuery } from '@/utils/users-query'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

// Сторінка, пошук і сортування беруться з адреси, а не з локального стану.
// Тому посилання /users?page=2&q=john можна скопіювати і відкрити той самий список
const listQuery = computed(() => parseUsersQuery(route.query))

function updateQuery(changes: Partial<UsersListQuery>, replace = false): void {
  const location = { name: 'users', query: toRouteQuery({ ...listQuery.value, ...changes }) }
  void (replace ? router.replace(location) : router.push(location))
}

// Завантаження даних при кожній зміні параметрів в адресі
watch(
  listQuery,
  (query) => {
    // Під час переходу на іншу сторінку адреса вже змінилась, а компонент ще не зник
    if (route.name !== 'users') {
      return
    }
    usersStore.lastListQuery = route.query
    void usersStore.loadUsers(query)
  },
  { immediate: true },
)

function handleSearch(query: string): void {
  if (query !== listQuery.value.q) {
    // replace: кожна введена літера не повинна створювати новий запис в історії браузера
    updateQuery({ q: query, page: 1 }, true)
  }
}

function changeSort(key: UserSortKey): void {
  const { sortBy, order } = listQuery.value
  const nextOrder = sortBy === key && order === 'asc' ? 'desc' : 'asc'
  updateQuery({ sortBy: key, order: nextOrder, page: 1 })
}

function changePage(page: number): void {
  updateQuery({ page })
}

function retry(): void {
  void usersStore.loadUsers(listQuery.value)
}

const startIndex = computed(() => (listQuery.value.page - 1) * USERS_PAGE_SIZE + 1)

const userToDelete = ref<User | null>(null)
</script>

<template>
  <WinnersList
    :winners="usersStore.winners"
    :can-pick-winner="usersStore.canPickWinner"
    @pick-winner="usersStore.pickWinner"
    @remove-winner="usersStore.removeWinner"
  />

  <section class="card">
    <div class="card-body">
      <div class="users__toolbar">
        <SearchBar
          class="flex-grow-1"
          :initial-query="listQuery.q"
          @filter-by-name="handleSearch"
        />
        <RouterLink class="btn btn-primary" :to="{ name: 'user-create' }">
          <i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Додати учасника
        </RouterLink>
      </div>

      <BaseAlert v-if="usersStore.error">
        Не вдалося завантажити учасників. {{ usersStore.error }}
        <template #action>
          <BaseButton variant="outline-secondary" small @click="retry">Спробувати ще раз</BaseButton>
        </template>
      </BaseAlert>

      <BaseLoader v-if="usersStore.isLoading && usersStore.users.length === 0" />

      <!-- Поки йде повторне завантаження, старий список трохи тьмяніє -->
      <div v-else :class="{ 'users__list--loading': usersStore.isLoading }">
        <UsersTable
          v-if="usersStore.users.length > 0"
          :users="usersStore.users"
          :start-index="startIndex"
          :sort-by="listQuery.sortBy"
          :order="listQuery.order"
          @sort="changeSort"
          @remove="userToDelete = $event"
        />
        <p v-else-if="!usersStore.error" class="users__empty">
          {{ listQuery.q ? `За запитом "${listQuery.q}" нікого не знайдено.` : 'Учасників немає.' }}
        </p>
      </div>

      <BasePagination
        class="mt-3"
        :current-page="listQuery.page"
        :total-pages="usersStore.totalPages"
        @change-page="changePage"
      />
    </div>
  </section>

  <UserDeleteModal
    v-if="userToDelete"
    :user="userToDelete"
    @close="userToDelete = null"
    @deleted="userToDelete = null"
  />
</template>

<style scoped lang="scss">
.users__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.users__list--loading {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.15s;
}

.users__empty {
  margin: 1.5rem 0 0.5rem;
  color: #98a6ad;
  text-align: center;
}
</style>
