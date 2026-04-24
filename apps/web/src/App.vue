<template>
  <div :class="$style.layout">
    <header :class="$style.header">
      <RouterLink to="/" :class="$style.brand">사주 (만세력)</RouterLink>
      <nav :class="$style.nav">
        <RouterLink to="/">소개</RouterLink>
        <RouterLink to="/input">사주 풀기</RouterLink>
      </nav>
    </header>
    <main :class="$style.main">
      <RouterView />
    </main>
    <footer :class="$style.footer">manseryeok 엔진 · 참고용</footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: $color-bg;
  color: $color-text;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid $color-border;
  background: $color-surface;
}

.brand {
  font-weight: 700;
  text-decoration: none;
  color: $color-text;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  gap: 1rem;
  a {
    color: $color-muted;
    text-decoration: none;
    font-size: 0.9rem;
    &.router-link-active {
      color: $color-accent;
    }
  }
}

.main {
  flex: 1;
  padding: 1.5rem 1.25rem 2.5rem;
  max-width: 42rem;
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  font-size: 0.75rem;
  color: $color-muted;
  padding: 1rem;
  border-top: 1px solid $color-border;
}
</style>
