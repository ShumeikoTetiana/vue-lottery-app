import { http } from '@/api/http-client'
import type { CreateUserDto, UpdateUserDto, User, UsersResponse } from '@/types/user'
import type {
  Creatable,
  Deletable,
  Editable,
  ListParams,
  PaginatedResult,
  Readable,
  Searchable,
} from './interfaces'

type QueryParams = ListParams & { q?: string }

// Перетворює об'єкт параметрів на рядок limit=10&skip=0, пропускаючи порожні
function buildQuery(params: QueryParams): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  }
  return query.toString()
}

function toPaginated(response: UsersResponse): PaginatedResult<User> {
  return {
    items: response.users,
    total: response.total,
    skip: response.skip,
    limit: response.limit,
  }
}

export class UserService
  implements
    Readable<User>,
    Searchable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll(params: ListParams = {}): Promise<PaginatedResult<User>> {
    const response = await http<UsersResponse>(`/users?${buildQuery(params)}`)
    return toPaginated(response)
  }

  async search(query: string, params: ListParams = {}): Promise<PaginatedResult<User>> {
    const response = await http<UsersResponse>(`/users/search?${buildQuery({ ...params, q: query })}`)
    return toPaginated(response)
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
