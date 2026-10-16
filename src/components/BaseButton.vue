<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: ButtonVariant
    disabled?: boolean
    small?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    small: false,
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
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
