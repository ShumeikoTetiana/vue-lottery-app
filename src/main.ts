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

app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)

setAuthHooks({
  getAccessToken: () => auth.accessToken,
  refreshAccessToken: () => auth.refreshAccessToken(),
  onUnauthorized: () => {
    auth.logout()
    void router.isReady().then(() => {
      const current = router.currentRoute.value
      if (current.meta.requiresAuth) {
        void router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    })
  },
})

void auth.fetchCurrentUser()

void router.isReady().then(() => app.mount('#app'))
