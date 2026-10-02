<template>
  <section :class="$style.card">
    <div :class="$style.header">
      <div :class="$style.badgeRow">
        <span :class="$style.yearBadge">
          {{ brief.year }}년 {{ brief.yearGanzhi }}년 세운
        </span>
        <span :class="$style.typeBadge">간략 포인트 운세</span>
      </div>
      <h2 :class="$style.themeTitle">{{ brief.keyTheme }}</h2>
    </div>

    <!-- 핵심 요약 가이드 (총운/월별과 겹치지 않는 포인트형) -->
    <div :class="$style.pointBox">
      <p :class="$style.pointText">
        {{ brief.briefKeypoint }}
      </p>
    </div>

    <!-- 행운 행동 & 주의 행동 그리드 -->
    <div :class="$style.actionsGrid">
      <div :class="[$style.actionItem, $style.lucky]">
        <div :class="$style.actionHeader">
          <span :class="$style.actionIcon">🍀</span>
          <span :class="$style.actionLabel">올해의 행운 행동</span>
        </div>
        <p :class="$style.actionDesc">{{ brief.luckyAction }}</p>
      </div>

      <div :class="[$style.actionItem, $style.caution]">
        <div :class="$style.actionHeader">
          <span :class="$style.actionIcon">⚠️</span>
          <span :class="$style.actionLabel">올해의 주의 행동</span>
        </div>
        <p :class="$style.actionDesc">{{ brief.cautionAction }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { YearlyBriefFortuneDto } from "@/types/chart"

defineProps<{
  brief: YearlyBriefFortuneDto
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
  gap: 0.4rem;
}

.badgeRow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.yearBadge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: rgba(196, 163, 90, 0.15);
  color: $color-accent;
  border-radius: $radius;
  border: 1px solid rgba(196, 163, 90, 0.3);
}

.typeBadge {
  font-size: 0.75rem;
  color: $color-muted;
}

.themeTitle {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: $color-text;
  letter-spacing: -0.02em;
}

.pointBox {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius;
  padding: 0.9rem 1rem;
}

.pointText {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: $color-text;
}

.actionsGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
}

.actionItem {
  padding: 0.85rem 1rem;
  border-radius: $radius;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &.lucky {
    background: rgba(46, 160, 67, 0.1);
    border: 1px solid rgba(46, 160, 67, 0.25);
  }

  &.caution {
    background: rgba(196, 92, 92, 0.1);
    border: 1px solid rgba(196, 92, 92, 0.25);
  }
}

.actionHeader {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.actionIcon {
  font-size: 0.95rem;
}

.actionLabel {
  font-size: 0.8rem;
  font-weight: 700;
  color: $color-text;
}

.actionDesc {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: $color-text;
  opacity: 0.9;
}
</style>
