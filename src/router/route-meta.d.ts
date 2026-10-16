import 'vue-router'

export {}

// Типізація поля meta у маршрутах
declare module 'vue-router' {
  interface RouteMeta {
    // Текст для заголовка вкладки браузера
    title?: string
    // Сторінка лише для авторизованих
    requiresAuth?: boolean
    // Сторінка лише для неавторизованих (логін)
    guestOnly?: boolean
    // Який layout використовувати
    layout?: 'default' | 'auth'
  }
}
