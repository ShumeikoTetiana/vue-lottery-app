import { AuthService } from './auth.service'
import { UserService } from './user.service'

// Фабрика: єдина точка отримання сервісів.
// Кожен сервіс створюється лише один раз, при першому зверненні
export class ServiceProvider {
  private static userService?: UserService
  private static authService?: AuthService

  static get users(): UserService {
    this.userService ??= new UserService()
    return this.userService
  }

  static get auth(): AuthService {
    this.authService ??= new AuthService()
    return this.authService
  }
}
