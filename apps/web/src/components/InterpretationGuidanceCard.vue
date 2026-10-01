<template>
  <section v-if="guidance" :class="$style.card">
    <div :class="$style.cardHeader">
      <span :class="$style.icon">🧭</span>
      <h3 :class="$style.cardTitle">처세 나침반: 피할 것과 가까이할 것</h3>
    </div>

    <!-- 금기 사항 & 주의 사항 -->
    <div :class="$style.warningBox">
      <div :class="$style.boxTitle">
        <span :class="$style.warnIcon">🚫</span>
        <strong>하지 말아야 할 것 (금기 사항)</strong>
      </div>
      <ul :class="$style.list">
        <li v-for="(item, i) in guidance.doNotDo" :key="'d-' + i">
          {{ item }}
        </li>
      </ul>

      <div :class="[$style.boxTitle, $style.cautionTitle]">
        <span :class="$style.warnIcon">⚠️</span>
        <strong>일상에서 조심해야 할 점</strong>
      </div>
      <ul :class="$style.list">
        <li v-for="(item, i) in guidance.cautions" :key="'c-' + i">
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 가까이 할 것 & 행운 요소 -->
    <div :class="$style.goodBox">
      <div :class="$style.boxTitle">
        <span :class="$style.goodIcon">🌟</span>
        <strong>곁에 두면 좋은 사람과 환경</strong>
      </div>
      <ul :class="$style.list">
        <li v-for="(item, i) in guidance.keepClose" :key="'k-' + i">
          {{ item }}
        </li>
      </ul>

      <div :class="$style.luckyGrid">
        <div :class="$style.luckyItem">
          <span :class="$style.luckyLabel">행운의 색상</span>
          <span :class="$style.luckyVal">{{ guidance.luckyElements.colors }}</span>
        </div>
        <div :class="$style.luckyItem">
          <span :class="$style.luckyLabel">행운의 소품</span>
          <span :class="$style.luckyVal">{{ guidance.luckyElements.items }}</span>
        </div>
        <div :class="$style.luckyItem">
          <span :class="$style.luckyLabel">행운의 장소</span>
          <span :class="$style.luckyVal">{{ guidance.luckyElements.environment }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EasyInterpretationDto } from "@/types/chart"

defineProps<{
  guidance?: EasyInterpretationDto["lifeGuidance"]
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

.warningBox {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 0.85rem;
}

.goodBox {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 6px;
  padding: 0.85rem;
}

.boxTitle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 0.45rem;
}

.cautionTitle {
  margin-top: 0.75rem;
  color: #fbbf24;
}

.warnIcon,
.goodIcon {
  font-size: 0.95rem;
}

.list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.83rem;
  line-height: 1.55;
  color: $color-text;
}

.luckyGrid {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.6rem;
  border-radius: 4px;
}

.luckyItem {
  display: flex;
  font-size: 0.8rem;
  line-height: 1.4;
}

.luckyLabel {
  width: 75px;
  flex-shrink: 0;
  color: $color-muted;
}

.luckyVal {
  color: $color-text;
  font-weight: 500;
}
</style>
