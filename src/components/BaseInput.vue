<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'number'
    placeholder?: string
    error?: string
    // touched: користувач уже працював з полем, тому можна показувати результат перевірки
    touched?: boolean
    autocomplete?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
    touched: false,
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  blur: []
}>()

// v-model компонента: батько пише <BaseInput v-model="value" />
const model = defineModel<string>({ required: true })

const isInvalid = computed(() => props.touched && props.error !== '')
const isValid = computed(() => props.touched && props.error === '')
</script>

<template>
  <div class="base-input mb-3">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="form-control"
      :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? `${id}-error` : undefined"
      @blur="emit('blur')"
    />
    <div v-if="isInvalid" :id="`${id}-error`" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>
