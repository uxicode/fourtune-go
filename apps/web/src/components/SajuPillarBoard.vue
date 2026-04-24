<template>
  <section :class="$style.board" aria-label="사주 네 기둥">
    <p :class="$style.summary">{{ summaryLine }}</p>
    <ul :class="$style.list">
      <li v-for="row in rows" :key="row.label" :class="$style.card">
        <span :class="$style.label">{{ row.label }}</span>
        <span :class="$style.ko">{{ row.korean }}</span>
        <span :class="$style.hanja">{{ row.hanja }}</span>
        <span :class="$style.sip"
          >십성: 천 {{ row.sipStem }} / 지(본기) {{ row.sipBr }}</span
        >
        <span :class="$style.meta">
          {{ row.stemEl }}·{{ row.branchEl }} / 천간 {{ row.stemYy }} · 지지 {{ row.branchYy }}
        </span>
      </li>
    </ul>
    <p v-if="timeIsApproximate" :class="$style.warn">시간이 근사값(정오)으로 들어갔습니다.</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { SajuChartDto } from "@/types/chart"

const props = defineProps<{
  chart: SajuChartDto
}>()

const summaryLine = computed(() => props.chart.summaryLine)

const timeIsApproximate = computed(() => props.chart.timeIsApproximate)

const rows = computed(() => {
  const c = props.chart.pillars
  const s = props.chart.sipsungByPillar
  return [
    {
      label: "년주",
      korean: c.year.korean,
      hanja: c.year.hanja,
      stemEl: c.year.stemElement,
      branchEl: c.year.branchElement,
      stemYy: c.year.stemYinYang,
      branchYy: c.year.branchYinYang,
      sipStem: s.year.stem,
      sipBr: s.year.branchFromMain,
    },
    {
      label: "월주",
      korean: c.month.korean,
      hanja: c.month.hanja,
      stemEl: c.month.stemElement,
      branchEl: c.month.branchElement,
      stemYy: c.month.stemYinYang,
      branchYy: c.month.branchYinYang,
      sipStem: s.month.stem,
      sipBr: s.month.branchFromMain,
    },
    {
      label: "일주",
      korean: c.day.korean,
      hanja: c.day.hanja,
      stemEl: c.day.stemElement,
      branchEl: c.day.branchElement,
      stemYy: c.day.stemYinYang,
      branchYy: c.day.branchYinYang,
      sipStem: s.day.stem,
      sipBr: s.day.branchFromMain,
    },
    {
      label: "시주",
      korean: c.hour.korean,
      hanja: c.hour.hanja,
      stemEl: c.hour.stemElement,
      branchEl: c.hour.branchElement,
      stemYy: c.hour.stemYinYang,
      branchYy: c.hour.branchYinYang,
      sipStem: s.hour.stem,
      sipBr: s.hour.branchFromMain,
    },
  ]
})
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.board {
  margin-top: 0.5rem;
}

.summary {
  font-size: 0.85rem;
  color: $color-muted;
  line-height: 1.5;
  margin: 0 0 1rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.card {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  grid-template-rows: auto auto auto;
  column-gap: 0.75rem;
  row-gap: 0.12rem;
  padding: 0.75rem 0.85rem;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
}

.sip {
  grid-column: 2;
  font-size: 0.78rem;
  color: $color-accent;
}

.label {
  grid-row: 1 / span 3;
  font-size: 0.75rem;
  color: $color-muted;
  align-self: center;
}

.ko {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.hanja {
  font-size: 0.85rem;
  color: $color-muted;
}

.meta {
  grid-column: 2;
  font-size: 0.72rem;
  color: $color-muted;
}

.warn {
  margin: 1rem 0 0;
  font-size: 0.8rem;
  color: $color-accent;
}
</style>
