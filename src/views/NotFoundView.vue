<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="card text-center">
    <div class="card-body py-5">
      <p class="not-found__code">404</p>
      <h1 class="h4">Сторінку не знайдено</h1>
      <p class="text-secondary">Можливо, адресу введено з помилкою або сторінку видалено.</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">На головну</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found__code {
  margin-bottom: 0.5rem;
  color: #3bafda;
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
}
</style>
