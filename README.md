# vue-lottery-app

Лабораторна робота №4: застосунок-лотерея на Vue 3 (Composition API, TypeScript, Bootstrap через scss, ESLint).

## Запуск

```sh
npm install      # встановити залежності (один раз)
npm run dev      # запустити, відкрити http://localhost:5173
npm run lint     # перевірка ESLint
npm run build    # перевірка типів і збірка
```

## Структура

```
src/
  main.ts                      точка входу: підключає стилі та монтує App
  App.vue                      увесь стан застосунку і логіка
  assets/styles/main.scss      Bootstrap частинами + кольори з дизайну
  types/participant.ts         типи TypeScript
  utils/validation.ts          перевірка полів форми (regexp, дата, унікальність e-mail)
  utils/storage.ts             читання і запис у localStorage
  components/
    BaseButton.vue             кнопка
    BaseInput.vue              поле вводу з підписом і помилкою
    WinnerItem.vue             один переможець (плашка з хрестиком)
    WinnersList.vue            блок переможців і кнопка New winner
    ParticipantForm.vue        форма з чотирма полями та валідацією
    RegistrationForm.vue       блок реєстрації (картка + ParticipantForm)
    ParticipantsTable.vue      блок таблиці, сортування, кнопки редагування/видалення
    SearchBar.vue              поле пошуку з debounce 300 мс
    BaseModal.vue              модальне вікно зі слотами
```

## Як рухаються дані

Увесь стан живе в `App.vue`. Дочірні компоненти отримують дані через props
і повідомляють про дії через події (emit); самі вони список не змінюють.

- `participants` - список учасників (`ref`). Відновлюється з localStorage при старті,
  зберігається через `watch(..., { deep: true })`.
- `winnerIds` - id переможців. `winners` і `candidates` обчислюються (`computed`).
- `nameFilter`, `sortKey`, `sortDirection` - стан пошуку та сортування.
  `visibleParticipants` спочатку фільтрує, потім сортує копію списку.
- `editedParticipant`, `participantToDelete` - кого зараз редагуємо або видаляємо.
  Поки там не `null`, показується відповідне модальне вікно.

## Де яка вимога завдання

| Вимога | Де в коді |
| --- | --- |
| Обов'язкові поля, regexp e-mail і телефону, дата не в майбутньому | `utils/validation.ts` |
| Показ помилок без alert | `BaseInput.vue` (`invalid-feedback`) |
| Очищення форми без спрацювання валідації | `ParticipantForm.vue`, `resetForm` скидає `dirty` і `touched` |
| Унікальність e-mail без урахування регістру | `validation.ts` (`normalizeEmail`), `App.vue` (`allEmails`, `emailsExceptEdited`) |
| Enter відправляє форму | `ParticipantForm.vue`, `@keydown.enter` |
| Не більше 3 переможців, кнопка неактивна | `App.vue`, `canPickWinner` |
| Переможець не обирається двічі | `App.vue`, `candidates` |
| Видалення переможця | `WinnerItem.vue` -> `WinnersList.vue` -> `App.vue` `removeWinner` |
| localStorage через watch з deep | `App.vue` + `utils/storage.ts` |
| Редагування в модальному вікні | `App.vue`, `BaseModal` + `ParticipantForm` |
| Підтвердження видалення | `App.vue`, другий `BaseModal`, `confirmDelete` |
| Сортування з іконками | `ParticipantsTable.vue` (кнопки в заголовках), `App.vue` `changeSort` |
| Пошук, подія filter-by-name, debounce 300 мс | `SearchBar.vue` |
| Esc закриває модальне вікно | `BaseModal.vue`, `@keydown.esc` |
| Bootstrap частинами через scss | `assets/styles/main.scss` |
