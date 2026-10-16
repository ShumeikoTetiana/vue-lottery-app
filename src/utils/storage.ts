import type { Participant } from '@/types/participant'

const STORAGE_KEY = 'vue-lottery-app:participants'

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.birthDate === 'string' &&
    typeof item.email === 'string' &&
    typeof item.phone === 'string'
  )
}

// Читаємо учасників з localStorage. Якщо там нічого немає
// або дані пошкоджені, повертаємо порожній список.
export function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isParticipant) : []
  } catch {
    return []
  }
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  } catch {
    // localStorage може бути недоступний (приватний режим, переповнення).
    // Застосунок при цьому продовжує працювати, просто без збереження.
  }
}
