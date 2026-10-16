<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { Participant, SortDirection, SortKey } from '@/types/participant'

const props = defineProps<{
  participants: Participant[]
  // Скільки учасників усього (до фільтрації), щоб розрізняти "список порожній" і "нічого не знайдено"
  totalCount: number
  sortKey: SortKey | null
  sortDirection: SortDirection
}>()

const emit = defineEmits<{
  sort: [key: SortKey]
  'filter-by-name': [query: string]
  edit: [participant: Participant]
  remove: [participant: Participant]
}>()

function isSortedBy(key: SortKey, direction: SortDirection): boolean {
  return props.sortKey === key && props.sortDirection === direction
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (props.sortKey !== key) {
    return 'none'
  }
  return props.sortDirection === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <section class="card">
    <div class="card-body">
      <SearchBar class="mb-3" @filter-by-name="emit('filter-by-name', $event)" />

      <div class="table-responsive">
        <table class="participants-table table align-middle mb-0">
          <thead>
            <tr>
              <th class="participants-table__number" scope="col">#</th>
              <th scope="col" :aria-sort="ariaSort('name')">
                <button class="participants-table__sort" type="button" @click="emit('sort', 'name')">
                  Name
                  <i
                    class="bi"
                    :class="{
                      'bi-sort-alpha-down': !isSortedBy('name', 'desc'),
                      'bi-sort-alpha-up': isSortedBy('name', 'desc'),
                      'participants-table__icon--active': sortKey === 'name',
                    }"
                    aria-hidden="true"
                  ></i>
                </button>
              </th>
              <th scope="col" :aria-sort="ariaSort('birthDate')">
                <button
                  class="participants-table__sort"
                  type="button"
                  @click="emit('sort', 'birthDate')"
                >
                  Date of Birth
                  <i
                    class="bi"
                    :class="{
                      'bi-sort-down': !isSortedBy('birthDate', 'desc'),
                      'bi-sort-up': isSortedBy('birthDate', 'desc'),
                      'participants-table__icon--active': sortKey === 'birthDate',
                    }"
                    aria-hidden="true"
                  ></i>
                </button>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col"><span class="visually-hidden">Редагування</span></th>
              <th scope="col"><span class="visually-hidden">Видалення</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="participant.id">
              <td class="participants-table__number">{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ participant.birthDate }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>
                <BaseButton variant="secondary" small @click="emit('edit', participant)">
                  Редагувати дані
                </BaseButton>
              </td>
              <td>
                <BaseButton variant="danger" small @click="emit('remove', participant)">
                  Видалити учасника
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="totalCount === 0" class="participants-table__empty">
        Учасників ще немає. Додайте першого через форму вище.
      </p>
      <p v-else-if="participants.length === 0" class="participants-table__empty">
        За цим іменем нікого не знайдено.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.participants-table {
  white-space: nowrap;

  th {
    color: #444;
    font-weight: 700;
  }
}

.participants-table__number {
  width: 2.5rem;
  color: #98a6ad;
}

.participants-table__sort {
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

  .participants-table__icon--active {
    color: #3bafda;
  }
}

.participants-table__empty {
  margin: 1rem 0 0;
  color: #98a6ad;
  text-align: center;
}
</style>
