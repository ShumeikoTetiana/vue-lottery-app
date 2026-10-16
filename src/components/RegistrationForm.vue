<script setup lang="ts">
import ParticipantForm from '@/components/ParticipantForm.vue'
import type { ParticipantFormData } from '@/types/participant'

defineProps<{
  takenEmails: string[]
}>()

const emit = defineEmits<{
  register: [data: ParticipantFormData]
}>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <h2 class="registration-form__title">Register form</h2>
      <p class="registration-form__hint">Please fill in all the fields.</p>
      <ParticipantForm
        id-prefix="register"
        submit-label="Save"
        :taken-emails="takenEmails"
        reset-after-submit
        @submit="emit('register', $event)"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.registration-form__title {
  margin-bottom: 0.15rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.registration-form__hint {
  margin-bottom: 1.5rem;
  color: #98a6ad;
}
</style>
