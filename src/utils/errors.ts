import { HttpError } from '@/api/http-client'

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message
  }
  if (error instanceof TypeError) {
    return 'Не вдалося з’єднатися з сервером. Перевірте інтернет і спробуйте ще раз.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Сталася невідома помилка.'
}
