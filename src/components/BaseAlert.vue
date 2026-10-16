<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'danger' | 'info' | 'warning'
  }>(),
  {
    variant: 'danger',
  },
)
</script>

<template>
  <div
    class="alert d-flex flex-wrap align-items-center gap-2"
    :class="`alert-${variant}`"
    :role="variant === 'danger' ? 'alert' : 'status'"
  >
    <div class="flex-grow-1">
      <slot />
    </div>
    <!-- Сюди можна передати кнопку, наприклад "Спробувати ще раз" -->
    <slot name="action" />
  </div>
</template>
