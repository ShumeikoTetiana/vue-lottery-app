import type { ParticipantField, ParticipantFormData } from '@/types/participant'

export type FormErrors = Record<ParticipantField, string>

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// +380 і рівно 9 цифр після нього
const PHONE_REGEXP = /^\+380\d{9}$/
const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/

const REQUIRED_MESSAGE = 'This value is required.'

// Сьогоднішня дата у форматі yyyy-mm-dd за місцевим часом
export function getTodayIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// Порівнюємо e-mail без урахування регістру та зайвих пробілів
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Перевіряє всі поля форми.
 * Повертає об'єкт, де для кожного поля лежить текст помилки
 * або порожній рядок, якщо поле заповнене правильно.
 * takenEmails - e-mail інших учасників (уже нормалізовані).
 */
export function validateParticipant(form: ParticipantFormData, takenEmails: string[]): FormErrors {
  const errors: FormErrors = { name: '', birthDate: '', email: '', phone: '' }

  if (!form.name.trim()) {
    errors.name = REQUIRED_MESSAGE
  }

  if (!form.birthDate) {
    errors.birthDate = REQUIRED_MESSAGE
  } else if (!DATE_REGEXP.test(form.birthDate)) {
    errors.birthDate = 'Date must be in yyyy-mm-dd format.'
  } else if (form.birthDate > getTodayIsoDate()) {
    // Рядки yyyy-mm-dd можна порівнювати як звичайний текст
    errors.birthDate = 'Date of birth cannot be in the future.'
  }

  if (!form.email.trim()) {
    errors.email = REQUIRED_MESSAGE
  } else if (!EMAIL_REGEXP.test(form.email.trim())) {
    errors.email = 'Please enter a valid email, for example name@example.com.'
  } else if (takenEmails.includes(normalizeEmail(form.email))) {
    errors.email = 'A participant with this email already exists.'
  }

  if (!form.phone.trim()) {
    errors.phone = REQUIRED_MESSAGE
  } else if (!PHONE_REGEXP.test(form.phone.trim())) {
    errors.phone = 'Phone must be in +380XXXXXXXXX format.'
  }

  return errors
}
