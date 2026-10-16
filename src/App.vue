<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import WinnersList from '@/components/WinnersList.vue'
import type {
  Participant,
  ParticipantFormData,
  SortDirection,
  SortKey,
} from '@/types/participant'
import { loadParticipants, saveParticipants } from '@/utils/storage'
import { normalizeEmail } from '@/utils/validation'

const MAX_WINNERS = 3

// ---------- Учасники ----------

// Відновлюємо список з localStorage при завантаженні застосунку
const participants = ref<Participant[]>(loadParticipants())

// Зберігаємо при будь-якій зміні. deep потрібен, щоб watcher помічав
// не лише додавання/видалення, а й зміну полів усередині учасника
watch(participants, (newParticipants) => saveParticipants(newParticipants), { deep: true })

const allEmails = computed(() => participants.value.map((item) => normalizeEmail(item.email)))

function registerParticipant(data: ParticipantFormData): void {
  participants.value.push({ id: crypto.randomUUID(), ...data })
}

// ---------- Переможці ----------

// Зберігаємо лише id переможців, а самі дані беремо зі списку учасників.
// Тому після редагування учасника його ім'я в блоці переможців теж оновлюється
const winnerIds = ref<string[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((item) => item.id === id))
    .filter((item): item is Participant => item !== undefined),
)

// Кандидати: учасники, які ще не є переможцями
const candidates = computed(() =>
  participants.value.filter((item) => !winnerIds.value.includes(item.id)),
)

// Кнопка активна, якщо переможців менше трьох і є з кого обирати.
// Порожній список учасників теж дає нуль кандидатів
const canPickWinner = computed(
  () => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0,
)

function pickWinner(): void {
  if (!canPickWinner.value) {
    return
  }
  const randomIndex = Math.floor(Math.random() * candidates.value.length)
  const winner = candidates.value[randomIndex]
  if (winner) {
    winnerIds.value.push(winner.id)
  }
}

function removeWinner(id: string): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

// ---------- Фільтрація та сортування ----------

const nameFilter = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

function changeSort(key: SortKey): void {
  if (sortKey.value === key) {
    // Повторний клік по тому самому стовпцю змінює напрямок
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// Спочатку фільтруємо, потім сортуємо. Вихідний масив participants не змінюється
const visibleParticipants = computed(() => {
  const query = nameFilter.value.toLowerCase()
  const filtered = participants.value.filter((item) => item.name.toLowerCase().includes(query))

  const key = sortKey.value
  if (key === null) {
    return filtered
  }

  const directionFactor = sortDirection.value === 'asc' ? 1 : -1
  return [...filtered].sort((a, b) => {
    const result =
      key === 'name'
        ? a.name.localeCompare(b.name, ['uk', 'en'], { sensitivity: 'base' })
        : a.birthDate.localeCompare(b.birthDate)
    return result * directionFactor
  })
})

// ---------- Редагування ----------

const editedParticipant = ref<Participant | null>(null)

// E-mail усіх учасників, крім того, якого редагуємо: власний e-mail не є дублікатом
const emailsExceptEdited = computed(() =>
  participants.value
    .filter((item) => item.id !== editedParticipant.value?.id)
    .map((item) => normalizeEmail(item.email)),
)

function updateParticipant(data: ParticipantFormData): void {
  const target = participants.value.find((item) => item.id === editedParticipant.value?.id)
  if (target) {
    Object.assign(target, data)
  }
  editedParticipant.value = null
}

// ---------- Видалення ----------

const participantToDelete = ref<Participant | null>(null)

function confirmDelete(): void {
  const id = participantToDelete.value?.id
  if (id !== undefined) {
    participants.value = participants.value.filter((item) => item.id !== id)
    // Якщо видалений учасник був переможцем, прибираємо його і звідти
    removeWinner(id)
  }
  participantToDelete.value = null
}
</script>

<template>
  <main class="lottery container">
    <h1 class="visually-hidden">Lottery</h1>

    <WinnersList
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="pickWinner"
      @remove-winner="removeWinner"
    />

    <RegistrationForm :taken-emails="allEmails" @register="registerParticipant" />

    <ParticipantsTable
      :participants="visibleParticipants"
      :total-count="participants.length"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      @sort="changeSort"
      @filter-by-name="nameFilter = $event"
      @edit="editedParticipant = $event"
      @remove="participantToDelete = $event"
    />

    <BaseModal
      v-if="editedParticipant"
      title="Редагування учасника"
      @close="editedParticipant = null"
    >
      <ParticipantForm
        id-prefix="edit"
        submit-label="Оновити дані"
        :taken-emails="emailsExceptEdited"
        :initial-data="editedParticipant"
        @submit="updateParticipant"
      >
        <template #actions>
          <BaseButton variant="secondary" @click="editedParticipant = null">Скасувати</BaseButton>
        </template>
      </ParticipantForm>
    </BaseModal>

    <BaseModal
      v-if="participantToDelete"
      title="Видалення учасника"
      @close="participantToDelete = null"
    >
      <p class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ participantToDelete.name }}", "{{
          participantToDelete.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="participantToDelete = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>

<style scoped lang="scss">
.lottery {
  max-width: 980px;
  padding-top: 3rem;
  padding-bottom: 3rem;
}
</style>
