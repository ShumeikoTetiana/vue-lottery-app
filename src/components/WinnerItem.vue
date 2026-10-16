<script setup lang="ts">
import type { User } from '@/types/user'

defineProps<{
  winner: User
}>()

const emit = defineEmits<{
  remove: [id: number]
}>()
</script>

<template>
  <span class="winner-item badge text-bg-primary">
    {{ winner.firstName }} {{ winner.lastName }}
    <button
      class="winner-item__remove"
      type="button"
      :aria-label="`Remove winner ${winner.firstName} ${winner.lastName}`"
      @click="emit('remove', winner.id)"
    >
      x
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff !important;
  font-size: 0.75rem;
}

.winner-item__remove {
  padding: 0;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}
</style>
