<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import type { SelectOption } from '@/types/form'

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    options: SelectOption[]
    placeholder?: string
    idPrefix?: string
  }>(),
  {
    placeholder: 'Оберіть…',
    idPrefix: 'field',
  },
)

const { value, errorMessage, meta, handleBlur } = useField<string | undefined>(() => props.name)

const selectId = computed(() => `${props.idPrefix}-${props.name}`)
const isInvalid = computed(() => meta.touched && Boolean(errorMessage.value))
const isValid = computed(() => meta.touched && !errorMessage.value)

const selected = computed({
  get: () => value.value ?? '',
  set: (newValue: string) => {
    value.value = newValue
  },
})
</script>

<template>
  <div class="mb-3">
    <label class="form-label" :for="selectId">{{ label }}</label>
    <select
      :id="selectId"
      v-model="selected"
      class="form-select"
      :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? `${selectId}-error` : undefined"
      @blur="handleBlur(undefined, true)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div v-if="isInvalid" :id="`${selectId}-error`" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>
