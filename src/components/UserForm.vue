<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import type { SelectOption } from '@/types/form'
import { createUserFormSchema, type UserFormValues } from '@/validation/schemas'

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit'
    submitLabel: string
    initialValues?: Partial<UserFormValues>
    isSubmitting?: boolean
    // Помилка від сервера показується над кнопками
    serverError?: string | null
  }>(),
  {
    initialValues: undefined,
    isSubmitting: false,
    serverError: null,
  },
)

const emit = defineEmits<{
  submit: [values: UserFormValues]
}>()

const genderOptions: SelectOption[] = [
  { value: 'female', label: 'Жіноча' },
  { value: 'male', label: 'Чоловіча' },
]

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    createUserFormSchema({ passwordRequired: props.mode === 'create' }),
  ),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    ...props.initialValues,
  },
})

// handleSubmit перевіряє всю форму і викликає функцію лише для правильних даних.
// Невалідні поля при цьому позначаються як touched, тому помилки стають видимими
const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <!-- novalidate вимикає вбудовані підказки браузера, бо помилки показує VeeValidate -->
  <form novalidate @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="firstName" label="First name" autocomplete="given-name" />
      </div>
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="lastName" label="Last name" autocomplete="family-name" />
      </div>
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="email" label="Email" type="email" autocomplete="email" />
      </div>
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="phone" label="Phone number" type="tel" placeholder="+380 63 123 4567" autocomplete="tel" />
      </div>
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="username" label="Username" autocomplete="username" />
      </div>
      <div class="col-md-6">
        <FormInput
          :id-prefix="mode"
          name="password"
          label="Password"
          type="password"
          :placeholder="mode === 'edit' ? 'Залиште порожнім, щоб не змінювати' : ''"
          autocomplete="new-password"
        />
      </div>
      <div class="col-md-6">
        <FormInput :id-prefix="mode" name="age" label="Age" type="number" />
      </div>
      <div class="col-md-6">
        <FormSelect :id-prefix="mode" name="gender" label="Gender" :options="genderOptions" />
      </div>
    </div>

    <BaseAlert v-if="serverError">{{ serverError }}</BaseAlert>

    <div class="d-flex justify-content-end gap-2 mt-2">
      <slot name="actions" />
      <BaseButton type="submit" :loading="isSubmitting">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
