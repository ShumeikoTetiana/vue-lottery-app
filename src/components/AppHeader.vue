<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import AppNavigation from '@/components/AppNavigation.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <AppLogo />
      <AppNavigation />
      <div v-if="auth.user" class="app-header__user">
        <UserAvatar
          :first-name="auth.user.firstName"
          :last-name="auth.user.lastName"
          :image="auth.user.image"
          :size="28"
        />
        <span>{{ auth.user.firstName }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.app-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
  max-width: 980px;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.app-header__user {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  color: #555;
  font-weight: 600;
}
</style>
