
export type Gender = 'male' | 'female'

export type UserRole = 'admin' | 'moderator' | 'user'

export interface UserAddress {
  address: string
  city: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: { lat: number; lng: number }
  country: string
}

export interface UserCompany {
  department: string
  name: string
  title: string
  address: UserAddress
}

export interface UserBank {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export interface UserCrypto {
  coin: string
  wallet: string
  network: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  maidenName?: string
  password?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: { color: string; type: string }
  ip?: string
  address?: UserAddress
  macAddress?: string
  university?: string
  bank?: UserBank
  company?: UserCompany
  ein?: string
  ssn?: string
  userAgent?: string
  crypto?: UserCrypto
  role?: UserRole
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'
> & { password: string }

export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export type UserSortKey = 'firstName' | 'age'
