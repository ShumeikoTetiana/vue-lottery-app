import { http } from '@/api/http-client'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'


const ACCESS_TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: ACCESS_TOKEN_LIFETIME_MINUTES }),
      skipAuthRefresh: true,
    })
  }

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
