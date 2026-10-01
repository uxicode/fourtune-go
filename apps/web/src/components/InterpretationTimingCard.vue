<template>
  <section v-if="timing" :class="$style.card">
    <div :class="$style.cardHeader">
      <span :class="$style.icon">🌊</span>
      <h3 :class="$style.cardTitle">운의 리듬: 상승기와 침체기 대처법</h3>
    </div>

    <!-- 운수 대통할 때 -->
    <div :class="$style.peakBox">
      <div :class="$style.boxTitle">
        <span :class="$style.peakIcon">🚀</span>
        <strong :class="$style.peakTitleText">운수 대통할 때 (상승기 징조)</strong>
      </div>
      <ul :class="$style.list">
        <li v-for="(sign, i) in timing.peakLuck.signs" :key="'p-' + i">
          {{ sign }}
        </li>
      </ul>
      <div :class="$style.strategyBox">
        <span :class="$style.strategyLabel">💡 기회를 잡는 행동 전략</span>
        <p :class="$style.strategyText">{{ timing.peakLuck.strategy }}</p>
      </div>
    </div>

    <!-- 운수 안 좋을 때 -->
    <div :class="$style.lowBox">
      <div :class="$style.boxTitle">
        <span :class="$style.lowIcon">🛡️</span>
        <strong :class="$style.lowTitleText">운수 안 좋을 때 (침체기 징조)</strong>
      </div>
      <ul :class="$style.list">
        <li v-for="(sign, i) in timing.lowLuck.signs" :key="'l-' + i">
          {{ sign }}
        </li>
      </ul>
      <div :class="$style.strategyBox">
        <span :class="$style.strategyLabel">🛡️ 위기를 넘기는 방어 전략</span>
        <p :class="$style.strategyText">{{ timing.lowLuck.strategy }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EasyInterpretationDto } from "@/types/chart"

defineProps<{
  timing?: EasyInterpretationDto["fortuneTiming"]
}>()
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.1rem;
}

.cardTitle {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.peakBox {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(26, 29, 36, 0.9));
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 6px;
  padding: 0.85rem;
}

.lowBox {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(26, 29, 36, 0.9));
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 6px;
  padding: 0.85rem;
}

.boxTitle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.peakTitleText {
  color: #fbbf24;
  font-size: 0.88rem;
}

.lowTitleText {
  color: #a5b4fc;
  font-size: 0.88rem;
}

.list {
  margin: 0 0 0.65rem;
  padding-left: 1.1rem;
  font-size: 0.83rem;
  line-height: 1.55;
  color: $color-text;
}

.strategyBox {
  background: rgba(0, 0, 0, 0.25);
  padding: 0.6rem 0.75rem;
  border-radius: 4px;
}

.strategyLabel {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: $color-accent;
  margin-bottom: 0.25rem;
}

.strategyText {
  font-size: 0.82rem;
  line-height: 1.5;
  color: $color-text;
  margin: 0;
}
</style>
