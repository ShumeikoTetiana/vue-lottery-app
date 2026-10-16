<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const links = [
  { name: 'home', label: 'Home' },
  { name: 'about', label: 'About author' },
  { name: 'users', label: 'Users' },
]

async function logout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav aria-label="Головне меню">
    <ul class="nav nav-pills flex-wrap gap-1">
      <li v-for="link in links" :key="link.name" class="nav-item">
        <!-- RouterLink сам додає клас active, коли маршрут збігається -->
        <RouterLink class="nav-link" :to="{ name: link.name }">{{ link.label }}</RouterLink>
      </li>
      <li class="nav-item">
        <button v-if="auth.isAuthenticated" class="nav-link" type="button" @click="logout">
          <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>Logout
        </button>
        <RouterLink v-else class="nav-link" :to="{ name: 'login' }">
          <i class="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>Login
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
