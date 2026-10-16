<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="default-layout__main container">
      <!-- Сюди потрапляє сторінка з <RouterView /> в App.vue -->
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
}

.default-layout__main {
  max-width: 980px;
  padding-top: 2rem;
  padding-bottom: 3rem;
}
</style>
