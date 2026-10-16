// Єдине місце, яке знає про fetch, базову адресу API та токени.
// Сервіси викликають лише http(), без жодних URL-адрес сервера

const BASE_URL = import.meta.env.VITE_API_URL

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

// Як отримати токен і що робити при 401. Задається в main.ts,
// щоб HTTP-клієнт не залежав напряму від Pinia-сторі
interface AuthHooks {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<boolean>
  onUnauthorized: () => void
}

let authHooks: AuthHooks | null = null

export function setAuthHooks(hooks: AuthHooks): void {
  authHooks = hooks
}

export interface HttpOptions extends RequestInit {
  // true для запитів login і refresh: при 401 на них не треба оновлювати токен
  skipAuthRefresh?: boolean
}

// Якщо кілька запитів одночасно отримали 401, токен оновлюється лише один раз
let refreshInProgress: Promise<boolean> | null = null

function refreshTokenOnce(): Promise<boolean> {
  if (!authHooks) {
    return Promise.resolve(false)
  }
  refreshInProgress ??= authHooks.refreshAccessToken().finally(() => {
    refreshInProgress = null
  })
  return refreshInProgress
}

function send(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = authHooks?.getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(`${BASE_URL}${path}`, { ...init, headers })
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const { message } = data
      if (typeof message === 'string') {
        return message
      }
    }
  } catch {
    // Тіло відповіді не JSON: використаємо стандартний текст нижче
  }
  return `HTTP ${response.status}: ${response.statusText}`
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { skipAuthRefresh = false, ...init } = options

  let response = await send(path, init)

  // Interceptor: сервер відповів 401, тобто accessToken прострочений.
  // Пробуємо оновити його через refreshToken і повторюємо запит один раз
  if (response.status === 401 && !skipAuthRefresh && authHooks?.getAccessToken()) {
    const refreshed = await refreshTokenOnce()
    if (refreshed) {
      response = await send(path, init)
    }
    if (response.status === 401) {
      authHooks?.onUnauthorized()
      throw new HttpError(401, 'Сесія завершилась. Увійдіть знову.')
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response))
  }

  return (await response.json()) as T
}
