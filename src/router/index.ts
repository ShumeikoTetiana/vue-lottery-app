import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const APP_NAME = 'Lottery'

// Усі сторінки завантажуються ліниво: код сторінки скачується лише при переході на неї
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    // Батьківський маршрут без компонента: лише спільна частина шляху і meta
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        path: 'new',
        name: 'user-create',
        component: () => import('@/views/UserCreateView.vue'),
        meta: { title: 'New user' },
      },
      {
        // (\\d+): id складається лише з цифр, тому /users/new сюди не потрапить
        path: ':id(\\d+)',
        name: 'user-details',
        component: () => import('@/views/UserDetailsView.vue'),
        // Параметр id передається в компонент як проп
        props: true,
        meta: { title: 'User details' },
        children: [
          {
            // Вкладений маршрут: форма показується всередині сторінки користувача
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            props: true,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    // Catch-all: усі інші адреси
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Клас Bootstrap для активного пункту меню
  linkActiveClass: 'active',
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation guard: виконується перед кожним переходом
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Запам'ятовуємо, куди хотів потрапити користувач, щоб повернути його після входу
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

// Після переходу міняємо заголовок вкладки
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_NAME}` : APP_NAME
})

export default router
