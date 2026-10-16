<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { ParticipantField, ParticipantFormData } from '@/types/participant'
import { getTodayIsoDate, validateParticipant } from '@/utils/validation'

const props = withDefaults(
  defineProps<{
    // Префікс для id полів, щоб дві форми на сторінці не мали однакових id
    idPrefix: string
    submitLabel: string
    // e-mail інших учасників, з якими не можна збігатися
    takenEmails: string[]
    // Початкові дані (для редагування). Якщо не передані, форма порожня
    initialData?: ParticipantFormData
    // Чи очищати форму після успішного збереження
    resetAfterSubmit?: boolean
  }>(),
  {
    initialData: undefined,
    resetAfterSubmit: false,
  },
)

const emit = defineEmits<{
  submit: [data: ParticipantFormData]
}>()

function createEmptyForm(): ParticipantFormData {
  return { name: '', birthDate: '', email: '', phone: '' }
}

function createFlags(): Record<ParticipantField, boolean> {
  return { name: false, birthDate: false, email: false, phone: false }
}

const form = reactive<ParticipantFormData>(
  props.initialData ? { ...props.initialData } : createEmptyForm(),
)

// dirty: користувач сам щось змінив у полі
const dirty = reactive(createFlags())
// touched: результат перевірки поля вже можна показувати
const touched = reactive(createFlags())

const today = ref(getTodayIsoDate())

// Помилки перераховуються автоматично при кожній зміні полів
const errors = computed(() => validateParticipant(form, props.takenEmails))

const isFormValid = computed(() => Object.values(errors.value).every((message) => message === ''))

function markDirty(field: ParticipantField): void {
  dirty[field] = true
}

// Коли користувач виходить з поля, показуємо результат перевірки,
// але тільки якщо він у цьому полі щось змінював
function handleBlur(field: ParticipantField): void {
  if (dirty[field]) {
    touched[field] = true
  }
}

function resetForm(): void {
  Object.assign(form, createEmptyForm())
  // Скидаємо позначки, тому після очищення помилки не з'являються
  Object.assign(dirty, createFlags())
  Object.assign(touched, createFlags())
}

function handleSubmit(): void {
  // При спробі зберегти показуємо помилки в усіх полях одразу
  touched.name = true
  touched.birthDate = true
  touched.email = true
  touched.phone = true
  today.value = getTodayIsoDate()

  if (!isFormValid.value) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })

  if (props.resetAfterSubmit) {
    resetForm()
  }
}

function handleEnter(event: KeyboardEvent): void {
  // Enter на кнопці має натискати саме цю кнопку (наприклад, "Скасувати")
  if (event.target instanceof HTMLButtonElement) {
    return
  }
  event.preventDefault()
  handleSubmit()
}
</script>

<template>
  <!-- novalidate вимикає вбудовані підказки браузера, бо ми показуємо власні помилки -->
  <form novalidate @submit.prevent="handleSubmit" @keydown.enter="handleEnter">
    <BaseInput
      :id="`${idPrefix}-name`"
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="errors.name"
      :touched="touched.name"
      @update:model-value="markDirty('name')"
      @blur="handleBlur('name')"
    />
    <BaseInput
      :id="`${idPrefix}-birth-date`"
      v-model="form.birthDate"
      label="Date of Birth"
      type="date"
      :max="today"
      :error="errors.birthDate"
      :touched="touched.birthDate"
      @update:model-value="markDirty('birthDate')"
      @blur="handleBlur('birthDate')"
    />
    <BaseInput
      :id="`${idPrefix}-email`"
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="errors.email"
      :touched="touched.email"
      @update:model-value="markDirty('email')"
      @blur="handleBlur('email')"
    />
    <BaseInput
      :id="`${idPrefix}-phone`"
      v-model="form.phone"
      label="Phone number"
      type="tel"
      placeholder="+380XXXXXXXXX"
      :error="errors.phone"
      :touched="touched.phone"
      @update:model-value="markDirty('phone')"
      @blur="handleBlur('phone')"
    />

    <div class="d-flex justify-content-end gap-2 mt-4">
      <!-- Додаткові кнопки (наприклад, "Скасувати") можна передати через слот -->
      <slot name="actions" />
      <BaseButton type="submit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
