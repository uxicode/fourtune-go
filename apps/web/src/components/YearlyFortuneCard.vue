<template>
  <section :class="$style.card">
    <div :class="$style.header">
      <div :class="$style.badgeRow">
        <span :class="$style.badge">Mode B VIP 리포트</span>
        <span :class="$style.yearTag">{{ detail.year }}년 {{ detail.yearGanzhi }}년</span>
      </div>
      <h2 :class="$style.title">🔮 올해 총운 심층 리포트</h2>
    </div>

    <!-- 1. 총평 -->
    <div :class="$style.summaryBox">
      <h3 :class="$style.sectionTitle">올해의 흐름 총평</h3>
      <p :class="$style.text">{{ detail.summary }}</p>
    </div>

    <!-- 2. 세부 4대 운세 그리드 -->
    <div :class="$style.luckGrid">
      <!-- 직업/사업운 -->
      <div :class="$style.luckItem">
        <div :class="$style.luckHead">
          <span :class="$style.luckIcon">💼</span>
          <span :class="$style.luckName">직업 & 사업운</span>
        </div>
        <p :class="$style.luckText">{{ detail.careerLuck }}</p>
      </div>

      <!-- 재물/투자운 -->
      <div :class="$style.luckItem">
        <div :class="$style.luckHead">
          <span :class="$style.luckIcon">💰</span>
          <span :class="$style.luckName">재물 & 투자운</span>
        </div>
        <p :class="$style.luckText">{{ detail.wealthLuck }}</p>
      </div>

      <!-- 애정/대인운 -->
      <div :class="$style.luckItem">
        <div :class="$style.luckHead">
          <span :class="$style.luckIcon">❤️</span>
          <span :class="$style.luckName">애정 & 대인관계운</span>
        </div>
        <p :class="$style.luckText">{{ detail.relationshipLuck }}</p>
      </div>

      <!-- 건강/활력운 -->
      <div :class="$style.luckItem">
        <div :class="$style.luckHead">
          <span :class="$style.luckIcon">🌿</span>
          <span :class="$style.luckName">건강 & 활력 가이드</span>
        </div>
        <p :class="$style.luckText">{{ detail.healthLuck }}</p>
      </div>
    </div>

    <!-- 3. 연간 하이라이트 (골든타임) -->
    <div :class="$style.highlightBox">
      <div :class="$style.highlightHead">
        <span :class="$style.highlightIcon">⏱️</span>
        <span :class="$style.highlightLabel">올해의 시기별 골든타임 & 주의 시점</span>
      </div>
      <p :class="$style.highlightText">{{ detail.monthlyHighlight }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { YearlyFortuneDetailDto } from "@/types/chart"

defineProps<{
  detail: YearlyFortuneDetailDto
}>()
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.card {
  background: $color-surface;
  border: 1px solid rgba(196, 163, 90, 0.3);
  border-radius: $radius;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.badgeRow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  background: $color-accent;
  color: $color-bg;
  border-radius: $radius;
}

.yearTag {
  font-size: 0.8rem;
  color: $color-muted;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: $color-text;
  letter-spacing: -0.02em;
}

.summaryBox {
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid $color-accent;
  padding: 0.85rem 1rem;
  border-radius: 0 $radius $radius 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sectionTitle {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: $color-accent;
}

.text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: $color-text;
}

.luckGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
}

.luckItem {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.luckHead {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.luckIcon {
  font-size: 1rem;
}

.luckName {
  font-size: 0.82rem;
  font-weight: 700;
  color: $color-text;
}

.luckText {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: $color-muted;
}

.highlightBox {
  background: rgba(196, 163, 90, 0.08);
  border: 1px dashed rgba(196, 163, 90, 0.35);
  border-radius: $radius;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.highlightHead {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.highlightIcon {
  font-size: 0.95rem;
}

.highlightLabel {
  font-size: 0.82rem;
  font-weight: 700;
  color: $color-accent;
}

.highlightText {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: $color-text;
}
</style>
