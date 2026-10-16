// TODO: замініть заглушки на свої дані (ПІБ, логін GitHub, навички)

export const AUTHOR = {
  fullName: 'Прізвище Ім’я По батькові',
  role: 'Студентка кафедри комп’ютерних наук ЧНУ',
  githubUsername: 'your-github',
}

export const GITHUB_PROFILE_URL = `https://github.com/${AUTHOR.githubUsername}`

export const REPOSITORY_URL = `${GITHUB_PROFILE_URL}/vue-lottery-app`

export const TECHNICAL_SKILLS = [
  'HTML',
  'CSS / SCSS',
  'JavaScript',
  'TypeScript',
  'Vue 3',
  'Vue Router',
  'Pinia',
  'Bootstrap',
  'Git',
]

export const PROJECT_TECHNOLOGIES = [
  { name: 'Vue 3', description: 'Composition API та <script setup>' },
  { name: 'TypeScript', description: 'типізація моделей, пропів, подій і сервісів' },
  { name: 'Vue Router', description: 'маршрути, вкладені маршрути, guard-и, ліниве завантаження' },
  { name: 'Pinia', description: 'сторі для авторизації та списку учасників' },
  { name: 'VeeValidate + Zod', description: 'валідація форм за схемами' },
  { name: 'Bootstrap 5', description: 'стилі, підключені частинами через SCSS' },
  { name: 'DummyJSON', description: 'REST API з користувачами та JWT-авторизацією' },
  { name: 'Vite та ESLint', description: 'збірка і перевірка коду' },
]
