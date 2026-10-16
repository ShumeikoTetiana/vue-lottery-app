# vue-lottery-app

Лабораторна робота №5: маршрутизація (Vue Router), патерн Repository для DummyJSON, авторизація через JWT.
Стек: Vue 3 (Composition API, TypeScript), Vue Router, Pinia, VeeValidate + Zod, Bootstrap 5 (SCSS), ESLint.

## Запуск

```sh
cp .env.example .env   # один раз: адреса API (на Windows: copy .env.example .env)
npm install
npm run dev            # http://localhost:5173
npm run lint
npm run build
npm run deploy         # збірка і публікація на GitHub Pages (гілка gh-pages)
```

Тестовий акаунт DummyJSON: `emilys` / `emilyspass`.

## Структура

```
src/
  main.ts                       запуск: Pinia, роутер, налаштування HTTP-клієнта
  App.vue                       вибір layout за meta.layout + <RouterView />
  router/index.ts               маршрути, guard-и, заголовок вкладки
  router/route-meta.d.ts        типи для поля meta
  api/http-client.ts            fetch, VITE_API_URL, заголовок Authorization, оновлення токена при 401
  services/interfaces.ts        Readable, Searchable, Creatable, Editable, Deletable
  services/user.service.ts      UserService (репозиторій користувачів)
  services/auth.service.ts      AuthService (login, me, refresh)
  services/service-provider.ts  фабрика ServiceProvider
  stores/auth.ts                токени і користувач (Pinia + localStorage)
  stores/users.ts               список, пагінація, локальні зміни, переможці
  types/user.ts, types/auth.ts  моделі за схемою DummyJSON, CreateUserDto, UpdateUserDto
  validation/schemas.ts         схеми Zod для форм
  utils/users-query.ts          читання і запис page, q, sortBy, order в адресі
  config/project.ts             ПІБ, GitHub, навички (замінити на свої)
  layouts/                      DefaultLayout, AuthLayout
  views/                        Home, About, Users, UserCreate, UserDetails, UserEdit, Login, NotFound
  components/                   AppHeader, AppNavigation, AppLogo, форми, таблиця, пагінація, модальні вікна
```

## Маршрути

| Адреса | Сторінка | Доступ |
| --- | --- | --- |
| `/` | Home | усім |
| `/about` | About author | усім |
| `/login` | Login (AuthLayout) | лише неавторизованим |
| `/users?page=&q=&sortBy=&order=` | список учасників | лише авторизованим |
| `/users/new` | створення учасника | лише авторизованим |
| `/users/:id` | інформація про учасника (`props: true`) | лише авторизованим |
| `/users/:id/edit` | вкладений маршрут редагування | лише авторизованим |
| усе інше | 404 | усім |

## Чому список зберігає зміни локально

DummyJSON лише імітує POST, PUT і DELETE: відповідь успішна, але дані на сервері не змінюються.
Тому `stores/users.ts` зберігає створених, змінених і видалених користувачів
і накладає ці зміни на кожну відповідь сервера. Зміни живуть до перезавантаження сторінки.
