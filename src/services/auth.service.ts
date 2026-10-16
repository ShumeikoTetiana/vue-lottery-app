import { http } from '@/api/http-client'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'

// Скільки хвилин живе accessToken. Щоб показати автоматичне оновлення
// токена на захисті, можна тимчасово поставити 1
const ACCESS_TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: ACCESS_TOKEN_LIFETIME_MINUTES }),
      skipAuthRefresh: true,
    })
  }

  // Захищений ендпоінт: http-клієнт сам додасть заголовок Authorization: Bearer
  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me')
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: ACCESS_TOKEN_LIFETIME_MINUTES }),
      skipAuthRefresh: true,
    })
  }
}
