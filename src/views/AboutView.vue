<script setup lang="ts">
import { AUTHOR, GITHUB_PROFILE_URL, TECHNICAL_SKILLS } from '@/config/project'
</script>

<template>
  <section class="card">
    <div class="card-body p-4">
      <h1 class="about__name">{{ AUTHOR.fullName }}</h1>
      <p class="about__role">{{ AUTHOR.role }}</p>

      <h2 class="h5 mt-4 mb-3">Technical skills</h2>
      <ul class="about__skills">
        <li v-for="skill in TECHNICAL_SKILLS" :key="skill" class="badge text-bg-primary">
          {{ skill }}
        </li>
      </ul>

      <h2 class="h5 mt-4 mb-2">GitHub</h2>
      <a :href="GITHUB_PROFILE_URL" target="_blank" rel="noopener">
        <i class="bi bi-github me-1" aria-hidden="true"></i>{{ GITHUB_PROFILE_URL }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about__name {
  margin-bottom: 0.25rem;
  font-size: 1.75rem;
  font-weight: 800;
}

.about__role {
  margin-bottom: 0;
  color: #777;
}

.about__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;

  .badge {
    color: #fff !important;
    font-size: 0.85rem;
    font-weight: 600;
  }
}
</style>
