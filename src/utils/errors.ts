import { HttpError } from '@/api/http-client'

// Перетворює будь-яку помилку на зрозумілий для користувача текст
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message
  }
  // fetch кидає TypeError, коли сервер недоступний або немає інтернету
  if (error instanceof TypeError) {
    return 'Не вдалося з’єднатися з сервером. Перевірте інтернет і спробуйте ще раз.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Сталася невідома помилка.'
}
