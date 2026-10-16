import { z } from 'zod'

// Схеми zod описують правила для форм. VeeValidate перевіряє поля за ними

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Вкажіть ім’я користувача'),
  password: z
    .string()
    .min(1, 'Вкажіть пароль')
    .min(6, 'Пароль має містити щонайменше 6 символів'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Одна схема для створення й редагування: при редагуванні пароль можна залишити порожнім
export function createUserFormSchema(options: { passwordRequired: boolean }) {
  return z.object({
    firstName: z.string().trim().min(1, 'Вкажіть ім’я'),
    lastName: z.string().trim().min(1, 'Вкажіть прізвище'),
    email: z.string().trim().min(1, 'Вкажіть email').email('Невірний формат email'),
    username: z
      .string()
      .trim()
      .min(3, 'Ім’я користувача має містити щонайменше 3 символи'),
    password: z
      .string()
      .refine(
        (value) => (options.passwordRequired ? value.length >= 6 : value === '' || value.length >= 6),
        'Пароль має містити щонайменше 6 символів',
      ),
    // coerce перетворює текст із поля вводу на число
    age: z.coerce
      .number({ invalid_type_error: 'Вкажіть вік числом' })
      .int('Вік має бути цілим числом')
      .min(1, 'Вік має бути від 1 до 120')
      .max(120, 'Вік має бути від 1 до 120'),
    gender: z.enum(['male', 'female'], {
      errorMap: () => ({ message: 'Оберіть стать' }),
    }),
    phone: z
      .string()
      .trim()
      .min(1, 'Вкажіть телефон')
      .regex(/^\+?[\d\s()-]{7,20}$/, 'Невірний формат телефону'),
  })
}

export type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>
