<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { PROJECT_TECHNOLOGIES, REPOSITORY_URL } from '@/config/project'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body p-4">
      <h1 class="home__title">Vue Lottery App</h1>
      <p class="home__lead">
        Застосунок-лотерея: список учасників завантажується з DummyJSON, учасників можна
        шукати, сортувати, переглядати, створювати, редагувати та видаляти, а серед них
        випадково обирати до трьох переможців.
      </p>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink class="btn btn-primary" :to="{ name: 'users' }">
          {{ auth.isAuthenticated ? 'Перейти до учасників' : 'Увійти та переглянути учасників' }}
        </RouterLink>
        <a class="btn btn-outline-secondary" :href="REPOSITORY_URL" target="_blank" rel="noopener">
          <i class="bi bi-github me-1" aria-hidden="true"></i>Код на GitHub
        </a>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-body p-4">
      <h2 class="h5 mb-3">Технології</h2>
      <ul class="home__technologies">
        <li v-for="technology in PROJECT_TECHNOLOGIES" :key="technology.name">
          <strong>{{ technology.name }}</strong>: {{ technology.description }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home__title {
  margin-bottom: 0.75rem;
  font-size: 2rem;
  font-weight: 800;
}

.home__lead {
  max-width: 60ch;
  margin-bottom: 1.5rem;
  color: #555;
  font-size: 1.05rem;
}

.home__technologies {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding-left: 1.2rem;
}
</style>
