export interface Participant {
  id: string
  name: string
  birthDate: string // формат yyyy-mm-dd
  email: string
  phone: string
}

// Дані форми: те саме, що учасник, але ще без id
export type ParticipantFormData = Omit<Participant, 'id'>

export type ParticipantField = keyof ParticipantFormData

export type SortKey = 'name' | 'birthDate'

export type SortDirection = 'asc' | 'desc'
