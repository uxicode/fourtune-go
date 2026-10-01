<template>
  <section v-if="healthCare" :class="$style.card">
    <div :class="$style.cardHeader">
      <span :class="$style.icon">🏥</span>
      <h3 :class="$style.cardTitle">건강 관리 및 체질 맞춤 가이드</h3>
    </div>

    <div :class="$style.badgeBox">
      <span :class="$style.label">주요 취약 부위</span>
      <span
        v-for="(area, i) in healthCare.vulnerableAreas"
        :key="i"
        :class="$style.areaBadge"
      >
        {{ area }}
      </span>
    </div>

    <p :class="$style.desc">{{ healthCare.description }}</p>

    <div :class="$style.tipBox">
      <strong :class="$style.tipTitle">💡 실천 건강 수칙</strong>
      <p :class="$style.tipText">{{ healthCare.lifestyleAdvice }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EasyInterpretationDto } from "@/types/chart"

defineProps<{
  healthCare?: EasyInterpretationDto["healthCare"]
}>()
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.1rem;
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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

.badgeBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.label {
  font-size: 0.75rem;
  color: $color-muted;
}

.areaBadge {
  font-size: 0.78rem;
  font-weight: 600;
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.desc {
  font-size: 0.86rem;
  line-height: 1.55;
  color: $color-text;
  margin: 0 0 0.75rem;
}

.tipBox {
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid #34d399;
  padding: 0.6rem 0.75rem;
  border-radius: 0 4px 4px 0;
}

.tipTitle {
  display: block;
  font-size: 0.8rem;
  color: #34d399;
  margin-bottom: 0.25rem;
}

.tipText {
  font-size: 0.84rem;
  line-height: 1.5;
  color: $color-text;
  margin: 0;
}
</style>
