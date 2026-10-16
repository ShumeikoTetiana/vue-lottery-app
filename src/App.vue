<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

// Layouts теж завантажуються асинхронно
const DefaultLayout = defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'))
const AuthLayout = defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))

const route = useRoute()

// Layout обирається за полем meta.layout поточного маршруту
const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DefaultLayout))
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
