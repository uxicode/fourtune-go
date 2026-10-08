<template>
  <section :class="$style.card">
    <div :class="$style.header">
      <div :class="$style.badgeRow">
        <span :class="$style.badge">결정 타이밍 가이드</span>
        <span :class="$style.countTag">이직 · 계약 · 이사</span>
      </div>
      <h2 :class="$style.title">🎯 결정 타이밍 — 이번 달 vs 다음 달</h2>
      <p :class="$style.lead">
        사주의 일간·신강/신약·십성 관계를 분석하여, 이직·계약 체결·이사 세 가지 결정에 대해
        <strong>{{ timing.thisMonthLabel }}</strong>과 <strong>{{ timing.nextMonthLabel }}</strong> 중
        어느 달이 더 유리한지 비교합니다.
      </p>
    </div>

    <div :class="$style.itemList">
      <article
        v-for="item in timing.items"
        :key="item.type"
        :class="$style.decisionCard"
      >
        <!-- 헤더: 결정 종류 + 추천 배지 -->
        <div :class="$style.decisionHeader">
          <div :class="$style.decisionTitle">
            <span :class="$style.decisionIcon">{{ item.icon }}</span>
            <h3 :class="$style.decisionLabel">{{ item.type }}</h3>
          </div>
          <span :class="[$style.recommendBadge, getRecommendClass(item.recommendation)]">
            {{ item.recommendation === "둘 다 비슷" ? "⚖️ 둘 다 비슷" : `✅ ${item.recommendation} 추천` }}
          </span>
        </div>

        <!-- 한 줄 요약 -->
        <p :class="$style.summaryText">{{ item.summary }}</p>

        <!-- 이번 달 vs 다음 달 비교 그리드 -->
        <div :class="$style.compareGrid">
          <!-- 이번 달 -->
          <div :class="[$style.monthBlock, isThisHigher(item) && $style.highlightBlock]">
            <div :class="$style.monthHeader">
              <span :class="$style.monthLabel">이번 달</span>
              <span :class="$style.ganzhiBadge">{{ item.thisMonth.ganzhi }}월</span>
              <span :class="[$style.gradeBadge, getGradeClass(item.thisMonth.grade)]">
                {{ item.thisMonth.grade }}
              </span>
            </div>
            <div :class="$style.scoreRow">
              <span :class="$style.scoreBar">
                <span
                  :class="$style.scoreFill"
                  :style="{ width: `${item.thisMonth.score * 10}%` }"
                />
              </span>
              <span :class="$style.scoreNum">{{ item.thisMonth.score }}/10</span>
            </div>
            <ul :class="$style.reasonList">
              <li v-for="(r, i) in item.thisMonth.reasons" :key="i">{{ r }}</li>
            </ul>
          </div>

          <!-- 다음 달 -->
          <div :class="[$style.monthBlock, isNextHigher(item) && $style.highlightBlock]">
            <div :class="$style.monthHeader">
              <span :class="$style.monthLabel">다음 달</span>
              <span :class="$style.ganzhiBadge">{{ item.nextMonth.ganzhi }}월</span>
              <span :class="[$style.gradeBadge, getGradeClass(item.nextMonth.grade)]">
                {{ item.nextMonth.grade }}
              </span>
            </div>
            <div :class="$style.scoreRow">
              <span :class="$style.scoreBar">
                <span
                  :class="$style.scoreFill"
                  :style="{ width: `${item.nextMonth.score * 10}%` }"
                />
              </span>
              <span :class="$style.scoreNum">{{ item.nextMonth.score }}/10</span>
            </div>
            <ul :class="$style.reasonList">
              <li v-for="(r, i) in item.nextMonth.reasons" :key="i">{{ r }}</li>
            </ul>
          </div>
        </div>
      </article>
    </div>

    <p :class="$style.notice">
      ※ 결정 타이밍은 사주의 월운 에너지와 나탈 차트의 관계를 기반으로 한 참고 지표입니다.
      실제 결정은 현실 여건을 최우선으로 판단하세요. (기준일: {{ timing.referenceDate }})
    </p>
  </section>
</template>

<script setup lang="ts">
import type { DecisionTimingDto, DecisionItem, DecisionGrade } from "@/types/chart"

defineProps<{
  timing: DecisionTimingDto
}>()

function isThisHigher(item: DecisionItem): boolean {
  return item.recommendation === "이번 달"
}

function isNextHigher(item: DecisionItem): boolean {
  return item.recommendation === "다음 달"
}

function getRecommendClass(rec: DecisionItem["recommendation"]): string {
  if (rec === "이번 달") return "recommend-this"
  if (rec === "다음 달") return "recommend-next"
  return "recommend-equal"
}

function getGradeClass(grade: DecisionGrade): string {
  const map: Record<DecisionGrade, string> = {
    "매우 좋음": "grade-great",
    "좋음": "grade-good",
    "보통": "grade-neutral",
    "신중": "grade-caution",
    "불리": "grade-bad",
  }
  return map[grade]
}
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
  gap: 1.25rem;
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

.countTag {
  font-size: 0.8rem;
  color: $color-muted;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: $color-text;
  letter-spacing: -0.02em;
}

.lead {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.55;
  color: $color-muted;

  strong {
    color: $color-accent;
    font-weight: 600;
  }
}

.itemList {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.decisionCard {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: rgba(196, 163, 90, 0.35);
  }
}

.decisionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.decisionTitle {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.decisionIcon {
  font-size: 1.3rem;
}

.decisionLabel {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: $color-text;
}

.recommendBadge {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
}

:global(.recommend-this) {
  background: rgba(74, 190, 100, 0.2);
  color: #5dcc7a;
  border: 1px solid rgba(74, 190, 100, 0.4);
}

:global(.recommend-next) {
  background: rgba(74, 144, 226, 0.2);
  color: #5ea7ff;
  border: 1px solid rgba(74, 144, 226, 0.4);
}

:global(.recommend-equal) {
  background: rgba(196, 163, 90, 0.15);
  color: $color-accent;
  border: 1px solid rgba(196, 163, 90, 0.3);
}

.summaryText {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: $color-text;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid $color-accent;
  padding: 0.65rem 0.9rem;
  border-radius: 0 $radius $radius 0;
}

.compareGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
}

.monthBlock {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.highlightBlock {
  background: rgba(196, 163, 90, 0.07);
  border-color: rgba(196, 163, 90, 0.35);
}

.monthHeader {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.monthLabel {
  font-size: 0.82rem;
  font-weight: 700;
  color: $color-text;
}

.ganzhiBadge {
  font-size: 0.78rem;
  font-weight: 600;
  color: $color-accent;
  background: rgba(196, 163, 90, 0.15);
  border: 1px solid rgba(196, 163, 90, 0.3);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.gradeBadge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
}

:global(.grade-great) {
  background: rgba(245, 166, 35, 0.2);
  color: #f5a623;
  border: 1px solid rgba(245, 166, 35, 0.4);
}
:global(.grade-good) {
  background: rgba(74, 144, 226, 0.2);
  color: #5ea7ff;
  border: 1px solid rgba(74, 144, 226, 0.4);
}
:global(.grade-neutral) {
  background: rgba(126, 211, 33, 0.2);
  color: #7ed321;
  border: 1px solid rgba(126, 211, 33, 0.4);
}
:global(.grade-caution) {
  background: rgba(248, 231, 28, 0.2);
  color: #f8e71c;
  border: 1px solid rgba(248, 231, 28, 0.4);
}
:global(.grade-bad) {
  background: rgba(224, 86, 86, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(224, 86, 86, 0.4);
}

.scoreRow {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.scoreBar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  overflow: hidden;
  display: block;
}

.scoreFill {
  display: block;
  height: 100%;
  background: $color-accent;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.scoreNum {
  font-size: 0.8rem;
  font-weight: 700;
  color: $color-accent;
  white-space: nowrap;
  min-width: 3.5rem;
  text-align: right;
}

.reasonList {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  list-style: disc;

  li {
    font-size: 0.8rem;
    line-height: 1.55;
    color: $color-muted;
  }
}

.notice {
  margin: 0;
  font-size: 0.75rem;
  color: $color-muted;
  line-height: 1.5;
  border-top: 1px solid $color-border;
  padding-top: 0.75rem;
}
</style>
