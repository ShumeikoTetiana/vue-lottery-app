<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <div class="auth-layout">
    <main class="auth-layout__panel">
      <div class="text-center mb-4">
        <AppLogo />
      </div>
      <slot />
      <p class="text-center mt-4 mb-0">
        <RouterLink :to="{ name: 'home' }">
          <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>На головну
        </RouterLink>
      </p>
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.auth-layout__panel {
  width: 100%;
  max-width: 400px;
}
</style>
