import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { ServiceProvider } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'
import { getErrorMessage } from '@/utils/errors'
import type { UsersListQuery } from '@/utils/users-query'

export const USERS_PAGE_SIZE = 10
export const MAX_WINNERS = 3

export const useUsersStore = defineStore('users', () => {
  const pageUsers = ref<User[]>([])
  const total = ref(0)
  const currentQuery = ref<UsersListQuery | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastListQuery = ref<LocationQuery>({})
  let latestRequestId = 0


  const createdUsers = ref<User[]>([])
  const updatedUsers = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])
  const loadedUsers = ref<Record<number, User>>({})
  let nextLocalId = 0

  function withLocalChanges(user: User): User {
    return updatedUsers.value[user.id] ?? user
  }

  function matchesSearch(user: User, query: string): boolean {
    if (!query) {
      return true
    }
    const text = `${user.firstName} ${user.lastName} ${user.username} ${user.email}`
    return text.toLowerCase().includes(query.toLowerCase())
  }

  function isLocalUser(id: number): boolean {
    return createdUsers.value.some((user) => user.id === id)
  }

  const users = computed<User[]>(() => {
    const fromServer = pageUsers.value
      .filter((user) => !deletedIds.value.includes(user.id))
      .map(withLocalChanges)

    const query = currentQuery.value
    if (!query || query.page !== 1) {
      return fromServer
    }
    const created = createdUsers.value.filter((user) => matchesSearch(user, query.q))
    return [...created, ...fromServer]
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / USERS_PAGE_SIZE)))

  async function loadUsers(query: UsersListQuery): Promise<void> {
    const requestId = ++latestRequestId
    isLoading.value = true
    error.value = null

    const params = {
      limit: USERS_PAGE_SIZE,
      skip: (query.page - 1) * USERS_PAGE_SIZE,
      sortBy: query.sortBy ?? undefined,
      order: query.sortBy ? query.order : undefined,
    }

    try {
      const result = query.q
        ? await ServiceProvider.users.search(query.q, params)
        : await ServiceProvider.users.getAll(params)
      if (requestId !== latestRequestId) {
        return
      }
      pageUsers.value = result.items
      total.value = result.total
      currentQuery.value = query
    } catch (loadError) {
      if (requestId !== latestRequestId) {
        return
      }
      error.value = getErrorMessage(loadError)
      pageUsers.value = []
      total.value = 0
      currentQuery.value = query
    } finally {
      if (requestId === latestRequestId) {
        isLoading.value = false
      }
    }
  }

  function findUser(id: number): User | null {
    if (deletedIds.value.includes(id)) {
      return null
    }
    return (
      createdUsers.value.find((user) => user.id === id) ??
      updatedUsers.value[id] ??
      pageUsers.value.find((user) => user.id === id) ??
      loadedUsers.value[id] ??
      null
    )
  }

  async function fetchUser(id: number): Promise<User> {
    if (deletedIds.value.includes(id)) {
      throw new Error('Цього користувача видалено.')
    }
    const known = findUser(id)
    if (known) {
      return known
    }
    const user = await ServiceProvider.users.getById(id)
    loadedUsers.value[id] = user
    return user
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const response = await ServiceProvider.users.create(data)
    const id = Math.max(Number(response.id), nextLocalId)
    nextLocalId = id + 1
    const user: User = { ...data, ...response, id }
    createdUsers.value.unshift(user)
    return user
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const current = await fetchUser(id)
    const response = isLocalUser(id) ? {} : await ServiceProvider.users.update(id, data)
    const updated: User = { ...current, ...response, ...data, id }

    if (isLocalUser(id)) {
      createdUsers.value = createdUsers.value.map((user) => (user.id === id ? updated : user))
    } else {
      updatedUsers.value[id] = updated
    }
    winners.value = winners.value.map((winner) => (winner.id === id ? updated : winner))
    return updated
  }

  async function deleteUser(id: number): Promise<void> {
    if (isLocalUser(id)) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    } else {
      await ServiceProvider.users.delete(id)
      deletedIds.value.push(id)
      delete updatedUsers.value[id]
    }
    removeWinner(id)
  }

  const winners = ref<User[]>([])

  const candidates = computed(() =>
    users.value.filter((user) => !winners.value.some((winner) => winner.id === user.id)),
  )

  const canPickWinner = computed(
    () => winners.value.length < MAX_WINNERS && candidates.value.length > 0,
  )

  function pickWinner(): void {
    if (!canPickWinner.value) {
      return
    }
    const randomIndex = Math.floor(Math.random() * candidates.value.length)
    const winner = candidates.value[randomIndex]
    if (winner) {
      winners.value.push(winner)
    }
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  return {
    users,
    total,
    totalPages,
    isLoading,
    error,
    lastListQuery,
    loadUsers,
    findUser,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    winners,
    canPickWinner,
    pickWinner,
    removeWinner,
  }
})
