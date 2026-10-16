<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link' | 'outline-secondary'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: ButtonVariant
    disabled?: boolean
    small?: boolean
    // Показує спінер і блокує кнопку, поки триває запит
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    small: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="btn"
    :class="[`btn-${variant}`, { 'btn-sm': small }]"
    :type="type"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
    <slot />
  </button>
</template>
