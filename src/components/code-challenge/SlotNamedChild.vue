<template>
  <div class="base-card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 14px 16px;
}

header {
  font-weight: 700;
  margin-bottom: 8px;
}
</style>
