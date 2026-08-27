<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { practiceGroups } from '@/router/practiceRoutes'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="brand">Skala-Vue Practice</RouterLink>
      <span class="brand-sub">Vue 3 Composition API 실습 모음</span>
    </header>

    <div class="app-body">
      <aside class="sidebar">
        <nav>
          <div v-for="group in practiceGroups" :key="group.groupId" class="nav-group">
            <p class="nav-group-title">{{ group.label }}</p>
            <ul>
              <li v-for="item in group.items" :key="item.path">
                <RouterLink :to="item.path" class="nav-link" active-class="nav-link-active">
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-size: 1.15rem;
  font-weight: 700;
  color: #42b883;
  text-decoration: none;
}

.brand-sub {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.app-body {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  padding: 20px 12px;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 20px;
}

.nav-group-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text);
  opacity: 0.55;
  padding: 0 12px;
  margin-bottom: 6px;
}

.nav-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-text);
  text-decoration: none;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: var(--color-background-mute);
}

.nav-link-active {
  color: #42b883;
  font-weight: 700;
  background-color: var(--color-background-mute);
}

.content {
  flex: 1;
  padding: 32px;
  max-width: 960px;
}

.practice-section {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.practice-section h2 {
  margin-bottom: 12px;
  color: var(--color-heading);
}

.practice-section h3 {
  margin: 16px 0 8px;
}

.practice-section button {
  cursor: pointer;
  border: 1px solid var(--color-border-hover);
  border-radius: 6px;
  padding: 6px 12px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.practice-section button:hover {
  border-color: #42b883;
  color: #42b883;
}

@media (max-width: 720px) {
  .app-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
