<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import type { SortOrder } from '@/services/interfaces'
import type { User, UserSortKey } from '@/types/user'

const props = defineProps<{
  users: User[]
  startIndex: number
  sortBy: UserSortKey | null
  order: SortOrder
}>()

const emit = defineEmits<{
  sort: [key: UserSortKey]
  remove: [user: User]
}>()

function isSortedBy(key: UserSortKey, order: SortOrder): boolean {
  return props.sortBy === key && props.order === order
}

function ariaSort(key: UserSortKey): 'ascending' | 'descending' | 'none' {
  if (props.sortBy !== key) {
    return 'none'
  }
  return props.order === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <div class="table-responsive">
    <table class="users-table table align-middle mb-0">
      <thead>
        <tr>
          <th class="users-table__number" scope="col">#</th>
          <th scope="col" :aria-sort="ariaSort('firstName')">
            <button class="users-table__sort" type="button" @click="emit('sort', 'firstName')">
              Name
              <i
                class="bi"
                :class="{
                  'bi-sort-alpha-down': !isSortedBy('firstName', 'desc'),
                  'bi-sort-alpha-up': isSortedBy('firstName', 'desc'),
                  'users-table__icon--active': sortBy === 'firstName',
                }"
                aria-hidden="true"
              ></i>
            </button>
          </th>
          <th scope="col" :aria-sort="ariaSort('age')">
            <button class="users-table__sort" type="button" @click="emit('sort', 'age')">
              Age
              <i
                class="bi"
                :class="{
                  'bi-sort-numeric-down': !isSortedBy('age', 'desc'),
                  'bi-sort-numeric-up': isSortedBy('age', 'desc'),
                  'users-table__icon--active': sortBy === 'age',
                }"
                aria-hidden="true"
              ></i>
            </button>
          </th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col"><span class="visually-hidden">Дії</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td class="users-table__number">{{ startIndex + index }}</td>
          <td>
            <RouterLink
              class="users-table__name"
              :to="{ name: 'user-details', params: { id: user.id } }"
            >
              <UserAvatar :first-name="user.firstName" :last-name="user.lastName" :image="user.image" />
              {{ user.firstName }} {{ user.lastName }}
            </RouterLink>
          </td>
          <td>{{ user.age }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td class="text-end">
            <div class="d-inline-flex gap-2">
              <RouterLink
                class="btn btn-secondary btn-sm"
                :to="{ name: 'user-edit', params: { id: user.id } }"
              >
                Редагувати дані
              </RouterLink>
              <BaseButton variant="danger" small @click="emit('remove', user)">
                Видалити учасника
              </BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.users-table {
  white-space: nowrap;

  th {
    color: #444;
    font-weight: 700;
  }
}

.users-table__number {
  width: 2.5rem;
  color: #98a6ad;
}

.users-table__name {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: inherit;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #3bafda;
  }
}

.users-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;

  .bi {
    color: #b5bdc2;
  }

  .users-table__icon--active {
    color: #3bafda;
  }
}
</style>
