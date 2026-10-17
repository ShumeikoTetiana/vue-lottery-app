import type { LocationQuery, LocationQueryRaw, LocationQueryValue } from 'vue-router'
import type { SortOrder } from '@/services/interfaces'
import type { UserSortKey } from '@/types/user'

export interface UsersListQuery {
  page: number
  q: string
  sortBy: UserSortKey | null
  order: SortOrder
}

function firstValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string {
  const single = Array.isArray(value) ? value[0] : value
  return typeof single === 'string' ? single : ''
}

export function parseUsersQuery(query: LocationQuery): UsersListQuery {
  const page = Number.parseInt(firstValue(query.page), 10)
  const sortBy = firstValue(query.sortBy)

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    q: firstValue(query.q).trim(),
    sortBy: sortBy === 'firstName' || sortBy === 'age' ? sortBy : null,
    order: firstValue(query.order) === 'desc' ? 'desc' : 'asc',
  }
}

export function toRouteQuery(state: UsersListQuery): LocationQueryRaw {
  return {
    page: state.page > 1 ? String(state.page) : undefined,
    q: state.q || undefined,
    sortBy: state.sortBy ?? undefined,
    order: state.sortBy ? state.order : undefined,
  }
}
