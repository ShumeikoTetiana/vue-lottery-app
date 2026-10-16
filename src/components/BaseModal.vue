<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const modalElement = useTemplateRef<HTMLDivElement>('modal')

onMounted(() => {
  // Переносимо фокус у вікно, щоб воно отримувало натискання клавіш (Esc)
  modalElement.value?.focus()
  document.body.classList.add('modal-open')
})

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <!-- Teleport переносить вікно в кінець body, щоб воно було поверх усієї сторінки -->
  <Teleport to="body">
    <div class="modal-backdrop show"></div>
    <div
      ref="modal"
      class="modal d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="base-modal-title"
      @keydown.esc="emit('close')"
      @click.self="emit('close')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="base-modal-title" class="modal-title fs-5">{{ title }}</h2>
            <button class="btn-close" type="button" aria-label="Закрити" @click="emit('close')"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <!-- Нижня панель з кнопками з'являється, лише якщо слот footer передано -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
