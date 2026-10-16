import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setAuthHooks } from './api/http-client'
import { useAuthStore } from './stores/auth'

import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

// Pinia підключаємо першою: guard роутера вже використовує сторі
app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)

// Пояснюємо HTTP-клієнту, де брати токен і що робити при 401
setAuthHooks({
  getAccessToken: () => auth.accessToken,
  refreshAccessToken: () => auth.refreshAccessToken(),
  onUnauthorized: () => {
    auth.logout()
    // Чекаємо, поки роутер визначить поточну сторінку (важливо при першому завантаженні)
    void router.isReady().then(() => {
      const current = router.currentRoute.value
      if (current.meta.requiresAuth) {
        void router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    })
  },
})

// Якщо в localStorage є токен, перевіряємо його через /auth/me
void auth.fetchCurrentUser()

// Монтуємо застосунок, коли роутер визначив першу сторінку,
// щоб не було миготіння неправильного layout
void router.isReady().then(() => app.mount('#app'))
