<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserDeleteModal from '@/components/UserDeleteModal.vue'
import { useUsersStore } from '@/stores/users'
import { getErrorMessage } from '@/utils/errors'

// id приходить як проп завдяки props: true у маршруті
const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const userId = computed(() => Number(props.id))

// Береться зі сторі, тому після редагування сторінка оновлюється сама
const user = computed(() => usersStore.findUser(userId.value))

const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    await usersStore.fetchUser(userId.value)
  } catch (loadError) {
    error.value = getErrorMessage(loadError)
  } finally {
    isLoading.value = false
  }
}

// Завантажуємо при відкритті і при переході на іншого користувача (/users/1 → /users/2)
watch(userId, loadUser, { immediate: true })

const isEditing = computed(() => route.name === 'user-edit')

const genderLabel = computed(() => (user.value?.gender === 'female' ? 'Жіноча' : 'Чоловіча'))

const address = computed(() => {
  const value = user.value?.address
  return value ? `${value.address}, ${value.city}, ${value.state}, ${value.country}` : null
})

const company = computed(() => {
  const value = user.value?.company
  return value ? `${value.title}, ${value.name} (${value.department})` : null
})

const isDeleteModalOpen = ref(false)

async function handleDeleted(): Promise<void> {
  isDeleteModalOpen.value = false
  await router.push({ name: 'users', query: usersStore.lastListQuery })
}
</script>

<template>
  <RouterLink class="d-inline-block mb-3" :to="{ name: 'users', query: usersStore.lastListQuery }">
    <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>До списку учасників
  </RouterLink>

  <BaseLoader v-if="isLoading && !user" />

  <BaseAlert v-else-if="error && !user">
    {{ error }}
    <template #action>
      <BaseButton variant="outline-secondary" small @click="loadUser">Спробувати ще раз</BaseButton>
    </template>
  </BaseAlert>

  <template v-else-if="user">
    <section class="card mb-3">
      <div class="card-body p-4">
        <div class="user-details__header">
          <UserAvatar
            :first-name="user.firstName"
            :last-name="user.lastName"
            :image="user.image"
            :size="80"
          />
          <div class="flex-grow-1">
            <h1 class="h3 mb-1">{{ user.firstName }} {{ user.lastName }}</h1>
            <p class="text-secondary mb-0">
              @{{ user.username }}
              <span v-if="user.role" class="badge text-bg-primary ms-1">{{ user.role }}</span>
            </p>
          </div>
          <div v-if="!isEditing" class="d-flex gap-2">
            <RouterLink class="btn btn-secondary" :to="{ name: 'user-edit', params: { id } }">
              Редагувати дані
            </RouterLink>
            <BaseButton variant="danger" @click="isDeleteModalOpen = true">
              Видалити учасника
            </BaseButton>
          </div>
        </div>

        <dl class="user-details__info">
          <dt>Email</dt>
          <dd>{{ user.email }}</dd>
          <dt>Phone number</dt>
          <dd>{{ user.phone }}</dd>
          <dt>Age</dt>
          <dd>{{ user.age }}</dd>
          <dt>Gender</dt>
          <dd>{{ genderLabel }}</dd>
          <template v-if="user.birthDate">
            <dt>Date of birth</dt>
            <dd>{{ user.birthDate }}</dd>
          </template>
          <template v-if="address">
            <dt>Address</dt>
            <dd>{{ address }}</dd>
          </template>
          <template v-if="company">
            <dt>Company</dt>
            <dd>{{ company }}</dd>
          </template>
          <template v-if="user.university">
            <dt>University</dt>
            <dd>{{ user.university }}</dd>
          </template>
        </dl>
      </div>
    </section>

    <!-- Вкладений маршрут /users/:id/edit показує форму редагування тут -->
    <RouterView />
  </template>

  <UserDeleteModal
    v-if="isDeleteModalOpen && user"
    :user="user"
    @close="isDeleteModalOpen = false"
    @deleted="handleDeleted"
  />
</template>

<style scoped lang="scss">
.user-details__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-details__info {
  display: grid;
  grid-template-columns: minmax(8rem, max-content) 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;

  dt {
    color: #777;
    font-weight: 600;
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 575.98px) {
  .user-details__info {
    grid-template-columns: 1fr;
    gap: 0.15rem;

    dd {
      margin-bottom: 0.6rem;
    }
  }
}
</style>
