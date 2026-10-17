import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { HttpError } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { getErrorMessage } from '@/utils/errors'

const STORAGE_KEY = 'vue-lottery-app:auth'

interface StoredAuth {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
}

function readStoredAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as StoredAuth
    }
  } catch {
  }
  return { accessToken: null, refreshToken: null, user: null }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = readStoredAuth()

  const accessToken = ref<string | null>(stored.accessToken)
  const refreshToken = ref<string | null>(stored.refreshToken)
  const user = ref<AuthUser | null>(stored.user)

  const isLoggingIn = ref(false)
  const loginError = ref<string | null>(null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  watch(
    [accessToken, refreshToken, user],
    () => {
      try {
        if (accessToken.value) {
          const data: StoredAuth = {
            accessToken: accessToken.value,
            refreshToken: refreshToken.value,
            user: user.value,
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
      }
    },
    { deep: true },
  )

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoggingIn.value = true
    loginError.value = null
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, ...profile } =
        await ServiceProvider.auth.login(credentials)
      accessToken.value = newAccessToken
      refreshToken.value = newRefreshToken
      user.value = profile
      return true
    } catch (error) {
      loginError.value =
        error instanceof HttpError && (error.status === 400 || error.status === 401)
          ? 'Невірне ім’я користувача або пароль.'
          : getErrorMessage(error)
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!accessToken.value) {
      return
    }
    try {
      user.value = await ServiceProvider.auth.getCurrentUser()
    } catch {
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }
    try {
      const tokens = await ServiceProvider.auth.refresh(refreshToken.value)
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      return true
    } catch {
      return false
    }
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isLoggingIn,
    loginError,
    login,
    fetchCurrentUser,
    refreshAccessToken,
    logout,
  }
})
