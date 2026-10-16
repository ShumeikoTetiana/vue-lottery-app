<script setup lang="ts">
import { computed } from 'vue'

const VISIBLE_PAGES = 5

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'change-page': [page: number]
}>()

// Номери сторінок навколо поточної: наприклад 3 4 [5] 6 7
const pages = computed(() => {
  const count = Math.min(VISIBLE_PAGES, props.totalPages)
  let start = Math.max(1, props.currentPage - Math.floor(VISIBLE_PAGES / 2))
  start = Math.min(start, props.totalPages - count + 1)
  return Array.from({ length: count }, (_, index) => start + index)
})

function goTo(page: number): void {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('change-page', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Сторінки списку">
    <ul class="pagination justify-content-center flex-wrap mb-0">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <button
          class="page-link"
          type="button"
          :disabled="currentPage <= 1"
          aria-label="Попередня сторінка"
          @click="goTo(currentPage - 1)"
        >
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button
          class="page-link"
          type="button"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <button
          class="page-link"
          type="button"
          :disabled="currentPage >= totalPages"
          aria-label="Наступна сторінка"
          @click="goTo(currentPage + 1)"
        >
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>
