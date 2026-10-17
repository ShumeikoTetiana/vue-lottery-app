<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const DefaultLayout = defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'))
const AuthLayout = defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))

const route = useRoute()

const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DefaultLayout))
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
