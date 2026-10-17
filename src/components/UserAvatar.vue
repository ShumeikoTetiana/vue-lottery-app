<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    firstName: string
    lastName: string
    image?: string
    size?: number
  }>(),
  {
    image: undefined,
    size: 32,
  },
)

const initials = computed(
  () => `${props.firstName.charAt(0)}${props.lastName.charAt(0)}`.toUpperCase(),
)
</script>

<template>
  <img
    v-if="image"
    class="user-avatar"
    :src="image"
    :alt="`${firstName} ${lastName}`"
    :width="size"
    :height="size"
  />
  <span
    v-else
    class="user-avatar user-avatar--initials"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.4}px` }"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>

<style scoped lang="scss">
.user-avatar {
  flex-shrink: 0;
  object-fit: cover;
  background: #eaf6fb;
  border-radius: 50%;
}

.user-avatar--initials {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2a8bb0;
  font-weight: 700;
}
</style>
