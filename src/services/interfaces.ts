// Узагальнені контракти репозиторію.
// Кожен інтерфейс описує одну можливість, тому сервіс реалізує лише ті, що йому потрібні

export type SortOrder = 'asc' | 'desc'

export interface ListParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: SortOrder
}

// Сторінка списку разом із загальною кількістю записів (потрібна для пагінації)
export interface PaginatedResult<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: ListParams): Promise<PaginatedResult<T>>
  getById(id: number): Promise<T>
}

export interface Searchable<T> {
  search(query: string, params?: ListParams): Promise<PaginatedResult<T>>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
