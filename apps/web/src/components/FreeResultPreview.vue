<template>
  <section :class="$style.card">
    <div :class="$style.header">
      <span :class="$style.badge">🌱 무료 맛보기 총평</span>
      <h2 :class="$style.title">한 줄 운명 분석</h2>
    </div>

    <div :class="$style.summaryBox">
      <p :class="$style.quote">"{{ oneLineSummary }}"</p>
    </div>

    <div v-if="keywords.length" :class="$style.keywords">
      <span v-for="(k, idx) in keywords" :key="idx" :class="$style.tag">
        # {{ k }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  oneLineSummary: string
  keywords: string[]
}>()
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  background: rgba(196, 163, 90, 0.15);
  color: $color-accent;
  border: 1px solid rgba(196, 163, 90, 0.3);
  border-radius: 999px;
}

.title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: $color-text;
}

.summaryBox {
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid $color-accent;
  padding: 0.85rem 1rem;
  border-radius: 0 $radius $radius 0;
}

.quote {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  color: $color-text;
  letter-spacing: -0.01em;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $color-border;
  color: $color-text;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}
</style>
