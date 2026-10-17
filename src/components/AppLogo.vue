<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink class="app-logo" :to="{ name: 'home' }" aria-label="Lottery, на головну">
    <svg class="app-logo__icon" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <path
        d="M4 9a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6z"
        fill="currentColor"
      />
      <path d="M20 9v14" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 2" />
      <circle cx="12.5" cy="16" r="3" fill="#fff" />
    </svg>
    <span class="app-logo__text">Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3bafda;
  font-size: 1.25rem;
  font-weight: 800;
  text-decoration: none;
}

.app-logo__text {
  color: #2b3a42;
  letter-spacing: -0.01em;
}
</style>
