<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Завантаження…',
  },
)
</script>

<template>
  <div class="d-flex align-items-center justify-content-center gap-2 py-4 text-secondary" role="status">
    <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
    <span>{{ text }}</span>
  </div>
</template>
