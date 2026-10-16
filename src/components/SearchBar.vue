<script setup lang="ts">
import { ref, watch } from 'vue'

const DEBOUNCE_MS = 300

const props = withDefaults(
  defineProps<{
    // Початковий текст (наприклад, з параметра ?q= в адресі)
    initialQuery?: string
  }>(),
  {
    initialQuery: '',
  },
)

const emit = defineEmits<{
  'filter-by-name': [query: string]
}>()

const query = ref(props.initialQuery)

// Якщо адреса змінилась ззовні (кнопка "Назад" у браузері), оновлюємо поле
watch(
  () => props.initialQuery,
  (newQuery) => {
    query.value = newQuery
  },
)

// Подію надсилаємо не на кожну літеру, а через 300 мс після останньої зміни.
// onCleanup скасовує попередній таймер, якщо користувач ще друкує
watch(query, (newQuery, _oldQuery, onCleanup) => {
  const timerId = setTimeout(() => {
    emit('filter-by-name', newQuery.trim())
  }, DEBOUNCE_MS)

  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <div class="search-bar">
    <label class="visually-hidden" for="search-by-name">Search by name</label>
    <input
      id="search-by-name"
      v-model="query"
      class="form-control"
      type="search"
      placeholder="Search by name"
    />
  </div>
</template>
