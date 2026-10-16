<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormInput from '@/components/FormInput.vue'
import { loginSchema, type LoginFormValues } from '@/validation/schemas'

withDefaults(
  defineProps<{
    isSubmitting?: boolean
    // Помилка авторизації від сервера ("Невірне ім'я користувача або пароль")
    serverError?: string | null
  }>(),
  {
    isSubmitting: false,
    serverError: null,
  },
)

const emit = defineEmits<{
  submit: [values: LoginFormValues]
}>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { username: '', password: '' },
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <FormInput id-prefix="login" name="username" label="Username" autocomplete="username" />
    <FormInput
      id-prefix="login"
      name="password"
      label="Password"
      type="password"
      autocomplete="current-password"
    />

    <BaseAlert v-if="serverError">{{ serverError }}</BaseAlert>

    <BaseButton class="w-100" type="submit" :loading="isSubmitting">Login</BaseButton>
  </form>
</template>
