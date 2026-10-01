<template>
  <div v-if="easy" :class="$style.wrapper">
    <!-- 헤더 배너: 한 줄 요약 & 키워드 태그 -->
    <div :class="$style.hero">
      <div :class="$style.badge">🌟 알기 쉬운 사주 종합 풀이</div>
      <h2 :class="$style.heroTitle">{{ easy.oneLineSummary }}</h2>
      <div :class="$style.tagList">
        <span v-for="tag in easy.keywords" :key="tag" :class="$style.tagChip">
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 카드 1: 타고난 성향과 본질 -->
    <section :class="$style.card">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">🌿</span>
        <h3 :class="$style.cardTitle">타고난 본질과 성향</h3>
        <span :class="$style.subBadge">{{ easy.dayMasterStory.stem }} · {{ easy.dayMasterStory.symbol }}</span>
      </div>
      <p :class="$style.text">{{ easy.dayMasterStory.personality }}</p>
      <div :class="$style.innerBox">
        <strong :class="$style.innerBoxTitle">💡 내면의 심리와 무의식적 가치관</strong>
        <p :class="$style.innerBoxText">{{ easy.dayMasterStory.innerMind }}</p>
      </div>
    </section>

    <!-- 카드 2: 중심 격국과 인생 테마 -->
    <section :class="$style.card">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">🎯</span>
        <h3 :class="$style.cardTitle">나의 중심 격국(格局)과 사회적 역할</h3>
      </div>
      <div :class="$style.gejuBanner">
        <span :class="$style.gejuCode">{{ easy.gejuAnalysis.code }}</span>
        <strong :class="$style.gejuName">{{ easy.gejuAnalysis.name }}</strong>
        <span :class="$style.gejuBadge">{{ easy.gejuAnalysis.badge }}</span>
      </div>
      <p :class="$style.text">{{ easy.gejuAnalysis.meaning }}</p>
      <div :class="$style.infoGrid">
        <div :class="$style.infoItem">
          <span :class="$style.infoLabel">사회적 역할</span>
          <span :class="$style.infoVal">{{ easy.gejuAnalysis.roleInLife }}</span>
        </div>
        <div :class="$style.infoItem">
          <span :class="$style.infoLabel">성장을 위한 조언</span>
          <span :class="$style.infoVal">{{ easy.gejuAnalysis.advice }}</span>
        </div>
      </div>
    </section>

    <!-- 카드 3: 직업 적성과 성공 전략 -->
    <section :class="$style.card">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">💼</span>
        <h3 :class="$style.cardTitle">직업 적성과 활약 분야</h3>
      </div>
      <h4 :class="$style.highlightTitle">{{ easy.careerAndTalent.title }}</h4>
      <ul :class="$style.bulletList">
        <li v-for="(str, i) in easy.careerAndTalent.strengths" :key="i">
          {{ str }}
        </li>
      </ul>
      <div :class="$style.infoGrid">
        <div :class="$style.infoItem">
          <span :class="$style.infoLabel">추천 분야</span>
          <span :class="$style.infoVal">{{ easy.careerAndTalent.recommendedFields }}</span>
        </div>
        <div :class="$style.infoItem">
          <span :class="$style.infoLabel">어울리는 환경</span>
          <span :class="$style.infoVal">{{ easy.careerAndTalent.workEnvironment }}</span>
        </div>
      </div>
    </section>

    <!-- 카드 4: 재물운 & 인간관계 -->
    <section :class="$style.card">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">💰</span>
        <h3 :class="$style.cardTitle">재물 스타일 & 인간관계 조언</h3>
      </div>
      <div :class="$style.dualCol">
        <div :class="$style.colBox">
          <div :class="$style.colHeader">
            <span :class="$style.colIcon">🪙</span>
            <strong>재물 관리: {{ easy.wealthStyle.title }}</strong>
          </div>
          <p :class="$style.colText">{{ easy.wealthStyle.pattern }}</p>
          <p :class="$style.colSub">{{ easy.wealthStyle.advice }}</p>
        </div>
        <div :class="$style.colBox">
          <div :class="$style.colHeader">
            <span :class="$style.colIcon">🤝</span>
            <strong>대인관계: {{ easy.relationshipStyle.title }}</strong>
          </div>
          <p :class="$style.colText">{{ easy.relationshipStyle.description }}</p>
          <p :class="$style.colSub">{{ easy.relationshipStyle.caution }}</p>
        </div>
      </div>
    </section>

    <!-- 카드 5: 오행 밸런스 및 맞춤 개운법 -->
    <section :class="$style.card">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">⚖️</span>
        <h3 :class="$style.cardTitle">오행 밸런스와 행운의 개운(開運) 팁</h3>
      </div>
      <div :class="$style.elementBar">
        <div
          v-for="el in elementOrder"
          :key="el"
          :class="[$style.elementItem, { [$style.isStrong]: easy.elementBalance.strongest.includes(el) }]"
        >
          <span :class="$style.elName">{{ el }}</span>
          <span :class="$style.elCount">{{ easy.elementBalance.counts[el] }}개</span>
        </div>
      </div>
      <div :class="$style.prescriptionBox">
        <strong :class="$style.presTitle">🍀 나를 돕는 일상 속 행운 습관:</strong>
        <ul :class="$style.presList">
          <li v-for="(p, i) in easy.elementBalance.prescriptions" :key="i">
            {{ p }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 카드 6: 건강 관리 및 체질 가이드 (사용자 요청) -->
    <InterpretationHealthCard :health-care="easy.healthCare" />

    <!-- 카드 7: 하지 말아야 할 것 & 조심할 점 & 가까이 할 것 (사용자 요청) -->
    <InterpretationGuidanceCard :guidance="easy.lifeGuidance" />

    <!-- 카드 8: 운수 대통할 때 vs 운수 안 좋을 때 (사용자 요청) -->
    <InterpretationTimingCard :timing="easy.fortuneTiming" />

    <!-- 카드 9: 올해 운세 가이드 -->
    <section :class="$style.cardHighlight">
      <div :class="$style.cardHeader">
        <span :class="$style.icon">✨</span>
        <h3 :class="$style.cardTitle">
          올해({{ easy.luckAdvice.currentYear }}년 {{ easy.luckAdvice.currentYearGanzhi }}) 운세 포인트
        </h3>
      </div>
      <p :class="$style.highlightText">{{ easy.luckAdvice.currentYearInsight }}</p>
      <p :class="$style.lessonText">"{{ easy.luckAdvice.lifeLesson }}"</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { EasyInterpretationDto } from "@/types/chart"
import InterpretationHealthCard from "@/components/InterpretationHealthCard.vue"
import InterpretationGuidanceCard from "@/components/InterpretationGuidanceCard.vue"
import InterpretationTimingCard from "@/components/InterpretationTimingCard.vue"

defineProps<{
  easy?: EasyInterpretationDto
}>()

const elementOrder: Array<"목" | "화" | "토" | "금" | "수"> = ["목", "화", "토", "금", "수"]
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero {
  background: linear-gradient(135deg, rgba(196, 163, 90, 0.15), rgba(26, 29, 36, 0.8));
  border: 1px solid rgba(196, 163, 90, 0.35);
  border-radius: $radius;
  padding: 1.25rem;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: $color-accent;
  background: rgba(196, 163, 90, 0.12);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}

.heroTitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.75rem;
  line-height: 1.45;
}

.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tagChip {
  font-size: 0.78rem;
  color: $color-text;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.1rem;
}

.cardHighlight {
  background: linear-gradient(180deg, rgba(196, 163, 90, 0.08), $color-surface);
  border: 1px solid rgba(196, 163, 90, 0.25);
  border-radius: $radius;
  padding: 1.1rem;
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
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

.subBadge {
  font-size: 0.75rem;
  color: $color-accent;
  background: rgba(196, 163, 90, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  margin-left: auto;
}

.text {
  font-size: 0.88rem;
  line-height: 1.6;
  color: $color-text;
  margin: 0 0 0.75rem;
}

.innerBox {
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid $color-accent;
  padding: 0.6rem 0.75rem;
  border-radius: 0 4px 4px 0;
}

.innerBoxTitle {
  display: block;
  font-size: 0.8rem;
  color: $color-accent;
  margin-bottom: 0.25rem;
}

.innerBoxText {
  font-size: 0.84rem;
  line-height: 1.5;
  color: $color-text;
  margin: 0;
}

.gejuBanner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.gejuCode {
  font-size: 0.75rem;
  font-weight: 700;
  color: $color-muted;
}

.gejuName {
  font-size: 0.95rem;
  color: #fff;
}

.gejuBadge {
  font-size: 0.75rem;
  color: $color-accent;
  border: 1px solid rgba(196, 163, 90, 0.4);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: auto;
}

.infoGrid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.infoItem {
  display: flex;
  font-size: 0.83rem;
  line-height: 1.5;
}

.infoLabel {
  width: 90px;
  flex-shrink: 0;
  color: $color-muted;
}

.infoVal {
  color: $color-text;
  flex: 1;
}

.highlightTitle {
  font-size: 0.9rem;
  font-weight: 700;
  color: $color-accent;
  margin: 0 0 0.5rem;
}

.bulletList {
  margin: 0 0 0.75rem;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  color: $color-text;
  line-height: 1.55;
}

.dualCol {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.colBox {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.75rem;
}

.colHeader {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 0.4rem;
}

.colIcon {
  font-size: 0.95rem;
}

.colText {
  font-size: 0.84rem;
  line-height: 1.5;
  color: $color-text;
  margin: 0 0 0.35rem;
}

.colSub {
  font-size: 0.8rem;
  line-height: 1.45;
  color: $color-muted;
  margin: 0;
}

.elementBar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.elementItem {
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.45rem 0.2rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.isStrong {
  border: 1px solid rgba(196, 163, 90, 0.4);
  background: rgba(196, 163, 90, 0.08);
}

.elName {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.elCount {
  font-size: 0.75rem;
  color: $color-muted;
}

.prescriptionBox {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  border-radius: 4px;
}

.presTitle {
  display: block;
  font-size: 0.82rem;
  color: $color-accent;
  margin-bottom: 0.35rem;
}

.presList {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: $color-text;
}

.highlightText {
  font-size: 0.88rem;
  line-height: 1.6;
  color: $color-text;
  margin: 0 0 0.5rem;
}

.lessonText {
  font-size: 0.82rem;
  font-style: italic;
  color: $color-muted;
  line-height: 1.5;
  margin: 0;
}
</style>
