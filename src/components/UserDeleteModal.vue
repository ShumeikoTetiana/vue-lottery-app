<script setup lang="ts">
import { ref } from 'vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'
import { getErrorMessage } from '@/utils/errors'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  close: []
  deleted: [id: number]
}>()

const usersStore = useUsersStore()
const isDeleting = ref(false)
const error = ref<string | null>(null)

async function confirmDelete(): Promise<void> {
  isDeleting.value = true
  error.value = null
  try {
    await usersStore.deleteUser(props.user.id)
    emit('deleted', props.user.id)
  } catch (deleteError) {
    error.value = getErrorMessage(deleteError)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <BaseModal title="Видалення учасника" @close="emit('close')">
    <p class="mb-0">
      Ви дійсно бажаєте видалити учасника "{{ user.firstName }} {{ user.lastName }}", "{{
        user.email
      }}"?
    </p>
    <BaseAlert v-if="error" class="mt-3 mb-0">{{ error }}</BaseAlert>
    <template #footer>
      <BaseButton variant="danger" :loading="isDeleting" @click="confirmDelete">Так</BaseButton>
      <BaseButton variant="secondary" :disabled="isDeleting" @click="emit('close')">Ні</BaseButton>
    </template>
  </BaseModal>
</template>
