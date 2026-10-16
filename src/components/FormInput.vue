<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import BaseInput from '@/components/BaseInput.vue'

// Поле форми, підключене до VeeValidate.
// Значення, помилку і стан "touched" бере з батьківської форми (useForm) за назвою поля
const props = withDefaults(
  defineProps<{
    name: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'number'
    placeholder?: string
    autocomplete?: string
    idPrefix?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocomplete: undefined,
    idPrefix: 'field',
  },
)

const { value, errorMessage, meta, handleBlur } = useField<unknown>(() => props.name)

// Writable computed: поле вводу завжди працює з рядком,
// навіть якщо у формі зберігається число (вік)
const textValue = computed({
  get: () => (value.value === undefined || value.value === null ? '' : String(value.value)),
  set: (newValue: string) => {
    value.value = newValue
  },
})
</script>

<template>
  <BaseInput
    :id="`${idPrefix}-${name}`"
    v-model="textValue"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :error="errorMessage ?? ''"
    :touched="meta.touched"
    @blur="handleBlur(undefined, true)"
  />
</template>
