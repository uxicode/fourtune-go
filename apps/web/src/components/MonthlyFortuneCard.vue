<template>
  <section :class="$style.card">
    <div :class="$style.header">
      <div :class="$style.headerTop">
        <div :class="$style.badgeRow">
          <span :class="$style.badge">Mode B VIP 리포트</span>
          <span :class="$style.countTag">12개월 정밀 분석</span>
        </div>
        <button
          v-if="onRefresh"
          type="button"
          :class="$style.refreshBtn"
          @click="$emit('refresh')"
        >
          🔄 최신 데이터 동기화
        </button>
      </div>

      <h2 :class="$style.title">📅 12개월 월별 운세 & 타이밍 가이드</h2>
      <p :class="$style.lead">
        사주의 신강/신약, 십성의 길흉, 일지와 월지의 충(沖)·합(合)을 정밀 분석하여 월별 운의 흐름(1~5점)과 영역별 실전 가이드를 제공합니다.
      </p>
    </div>

    <!-- 분기별 필터 탭 -->
    <div :class="$style.tabs">
      <button
        type="button"
        :class="[$style.tab, activeQuarter === 0 && $style.activeTab]"
        @click="activeQuarter = 0"
      >
        전체 (1~12월)
      </button>
      <button
        v-for="q in [1, 2, 3, 4]"
        :key="q"
        type="button"
        :class="[$style.tab, activeQuarter === q && $style.activeTab]"
        @click="activeQuarter = q"
      >
        {{ q }}분기 ({{ (q - 1) * 3 + 1 }}~{{ q * 3 }}월)
      </button>
    </div>

    <!-- 월별 운세 리스트 -->
    <div :class="$style.monthList">
      <article
        v-for="m in filteredMonths"
        :key="m.month"
        :class="[$style.monthCard, getScoreClass(m.score)]"
      >
        <!-- 상단 헤더: 월, 간지, 별점, 운세 상태 라벨 -->
        <div :class="$style.cardTop">
          <div :class="$style.monthIdentity">
            <span :class="$style.monthTitle">{{ m.solarMonthName }}</span>
            <span :class="$style.ganzhiBadge">{{ m.ganzhi }}월</span>
            <span :class="[$style.statusBadge, getStatusBadgeClass(m.score)]">
              {{ m.scoreLabel || getScoreLabelFallback(m.score) }}
            </span>
          </div>

          <div :class="$style.ratingBox">
            <span :class="$style.stars">
              {{ '★'.repeat(m.score) }}{{ '☆'.repeat(5 - m.score) }}
            </span>
            <span :class="$style.scoreText">{{ m.score }} / 5</span>
          </div>
        </div>

        <!-- 핵심 테마 키워드 -->
        <div :class="$style.keywordWrap">
          <span :class="$style.keywordTag"># {{ m.keyword }}</span>
        </div>

        <!-- 1. 월별 종합 흐름 총평 -->
        <div :class="$style.summarySection">
          <div :class="$style.sectionHead">
            <span :class="$style.sectionIcon">🌟</span>
            <h4 :class="$style.summaryTitle">월간 흐름 총평</h4>
          </div>
          <p :class="$style.summaryText">{{ m.summary }}</p>
        </div>

        <!-- 2. 세부 4대 영역 심층 풀이 -->
        <div :class="$style.detailContainer">
          <!-- 직업 & 사업운 -->
          <div :class="$style.detailBox">
            <div :class="$style.detailHead">
              <span :class="$style.detailIcon">💼</span>
              <strong :class="$style.detailLabel">직업 & 사업운</strong>
            </div>
            <p :class="$style.detailContent">{{ getCareerText(m) }}</p>
          </div>

          <!-- 재물 & 금전운 -->
          <div :class="$style.detailBox">
            <div :class="$style.detailHead">
              <span :class="$style.detailIcon">💰</span>
              <strong :class="$style.detailLabel">재물 & 투자운</strong>
            </div>
            <p :class="$style.detailContent">{{ getWealthText(m) }}</p>
          </div>

          <!-- 애정 & 대인관계 -->
          <div :class="$style.detailBox">
            <div :class="$style.detailHead">
              <span :class="$style.detailIcon">❤️</span>
              <strong :class="$style.detailLabel">애정 & 대인관계</strong>
            </div>
            <p :class="$style.detailContent">{{ getRelText(m) }}</p>
          </div>

          <!-- 실천 팁 & 주의사항 -->
          <div :class="[$style.detailBox, $style.adviceBox]">
            <div :class="$style.detailHead">
              <span :class="$style.detailIcon">💡</span>
              <strong :class="$style.detailLabel">실천 팁 & 주의사항</strong>
            </div>
            <p :class="$style.detailContent">{{ getAdviceText(m) }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, useCssModule } from "vue"
import type { MonthlyFortuneDto } from "@/types/chart"

const props = defineProps<{
  months: MonthlyFortuneDto[]
  onRefresh?: () => void
}>()

defineEmits<{
  refresh: []
}>()

const style = useCssModule()
const activeQuarter = ref<number>(0) // 0: 전체, 1: 1Q, 2: 2Q, 3: 3Q, 4: 4Q

const filteredMonths = computed(() => {
  if (activeQuarter.value === 0) return props.months
  const start = (activeQuarter.value - 1) * 3 + 1
  const end = activeQuarter.value * 3
  return props.months.filter((m) => m.month >= start && m.month <= end)
})

function getScoreLabelFallback(score: number): string {
  if (score >= 5) return "대길(大吉)"
  if (score === 4) return "호조(好調)"
  if (score === 3) return "평온(平穩)"
  if (score === 2) return "신중(愼重)"
  return "수성(守成)"
}

function getCareerText(m: MonthlyFortuneDto): string {
  if (m.career && m.career.trim()) return m.career
  if (m.score >= 4) {
    return `${m.solarMonthName}은 자신의 전문 역량과 기획력이 최고조에 달하는 시기입니다. 중요한 프로젝트나 제안이 있다면 주도적으로 실행하여 기대 이상의 호평과 성과를 이끌어내세요.`
  }
  if (m.score === 3) {
    return `${m.solarMonthName}은 업무의 기본기를 점검하고 루틴을 정비하기에 적합한 달입니다. 파격적인 변화보다 현재 맡은 일의 완성도를 꼼꼼히 높이는 것이 유리합니다.`
  }
  return `${m.solarMonthName}은 업무 피로도가 높아지거나 추진하던 일정에 변동이 생기기 쉽습니다. 중요한 계약은 두 번 이상 검토하고 상사나 동료와의 감정적 마찰을 피하세요.`
}

function getWealthText(m: MonthlyFortuneDto): string {
  if (m.wealth && m.wealth.trim()) return m.wealth
  if (m.score >= 4) {
    return `금전운이 활짝 열리는 시기입니다. 노력한 만큼 정당하고 실속 있는 재물 보상이 따르며, 보너스나 성과급 등 목돈이 유입될 가능성이 높습니다.`
  }
  if (m.score === 3) {
    return `수입과 지출이 평온하게 균형을 이루는 달입니다. 충동적인 지출을 자제하고 가계부를 정돈하면 안정적인 현금 흐름을 유지할 수 있습니다.`
  }
  return `예상치 못한 손재수나 돌발 지출을 경계해야 하는 달입니다. 동업이나 고위험 투자는 일절 피하고 현금을 지키는 보수적 운용을 하세요.`
}

function getRelText(m: MonthlyFortuneDto): string {
  if (m.relationship && m.relationship.trim()) return m.relationship
  if (m.score >= 4) {
    return `주변 사람들이 내 편이 되어주고 따뜻한 온기가 감도는 시기입니다. 연인 간에는 애정이 한층 깊어지며, 솔로는 호감 가는 새로운 인연을 만나기 좋습니다.`
  }
  if (m.score === 3) {
    return `가까운 지인 및 가족과의 잔잔하고 편안한 유대감이 이어집니다. 소소한 식사 자리를 통해 관계의 온도를 다정하게 유지하세요.`
  }
  return `사소한 말 한마디로 오해나 자존심 싸움이 생기기 쉽습니다. 상대방을 이기려 들지 말고 경청과 양보의 자세를 취하세요.`
}

function getAdviceText(m: MonthlyFortuneDto): string {
  if (m.advice && m.advice.trim()) return m.advice
  if (m.score >= 4) {
    return `✨ 실천 팁: 주저하던 결정을 내리고 적극적으로 제안하세요. 행운이 뒤를 받쳐줍니다. / ⚠️ 주의: 자만심으로 주변 동료를 소홀히 대하지 마세요.`
  }
  if (m.score === 3) {
    return `✨ 실천 팁: 꾸준한 운동과 수면 패턴을 지키고 부족한 역량을 채우세요. / ⚠️ 주의: 일상의 단조로움에 빠져 나태해지지 않도록 유의하세요.`
  }
  return `✨ 실천 팁: 안전과 건강을 최우선으로 두고 수성에 집중하세요. / ⚠️ 주의: 감정적인 폭발, 과속 운전, 무리한 야근이나 과음을 철저히 피하세요.`
}

function getScoreClass(score: number): string {
  if (score >= 5) return style.score5
  if (score === 4) return style.score4
  if (score === 3) return style.score3
  if (score === 2) return style.score2
  return style.score1
}

function getStatusBadgeClass(score: number): string {
  if (score >= 5) return style.status5
  if (score === 4) return style.status4
  if (score === 3) return style.status3
  if (score === 2) return style.status2
  return style.status1
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

.headerTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.refreshBtn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid $color-border;
  color: $color-accent;
  border-radius: $radius;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(196, 163, 90, 0.15);
    border-color: rgba(196, 163, 90, 0.4);
  }
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
  line-height: 1.5;
  color: $color-muted;
}

.tabs {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    height: 4px;
  }
}

.tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $color-border;
  color: $color-muted;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: $color-text;
    background: rgba(255, 255, 255, 0.1);
  }
}

.activeTab {
  background: rgba(196, 163, 90, 0.2) !important;
  color: $color-accent !important;
  border-color: rgba(196, 163, 90, 0.4) !important;
}

.monthList {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.monthCard {
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: rgba(196, 163, 90, 0.4);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
}

.score5 {
  border-left: 4px solid #f5a623;
}
.score4 {
  border-left: 4px solid #4a90e2;
}
.score3 {
  border-left: 4px solid #7ed321;
}
.score2 {
  border-left: 4px solid #f8e71c;
}
.score1 {
  border-left: 4px solid #e05656;
}

.cardTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.monthIdentity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.monthTitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: $color-text;
}

.ganzhiBadge {
  font-size: 0.8rem;
  font-weight: 600;
  color: $color-accent;
  background: rgba(196, 163, 90, 0.15);
  border: 1px solid rgba(196, 163, 90, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.statusBadge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}

.status5 {
  background: rgba(245, 166, 35, 0.2);
  color: #f5a623;
  border: 1px solid rgba(245, 166, 35, 0.4);
}
.status4 {
  background: rgba(74, 144, 226, 0.2);
  color: #5ea7ff;
  border: 1px solid rgba(74, 144, 226, 0.4);
}
.status3 {
  background: rgba(126, 211, 33, 0.2);
  color: #7ed321;
  border: 1px solid rgba(126, 211, 33, 0.4);
}
.status2 {
  background: rgba(248, 231, 28, 0.2);
  color: #f8e71c;
  border: 1px solid rgba(248, 231, 28, 0.4);
}
.status1 {
  background: rgba(224, 86, 86, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(224, 86, 86, 0.4);
}

.ratingBox {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.stars {
  font-size: 1rem;
  color: #f5a623;
  letter-spacing: 0.05em;
}

.scoreText {
  font-size: 0.8rem;
  color: $color-muted;
  font-weight: 600;
}

.keywordWrap {
  display: flex;
}

.keywordTag {
  font-size: 0.82rem;
  font-weight: 600;
  color: $color-accent;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(196, 163, 90, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.summarySection {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid $color-accent;
  padding: 0.85rem 1rem;
  border-radius: 0 $radius $radius 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sectionHead {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sectionIcon {
  font-size: 0.85rem;
}

.summaryTitle {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: $color-accent;
}

.summaryText {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: $color-text;
}

.detailContainer {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.detailBox {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.adviceBox {
  @media (min-width: 640px) {
    grid-column: 1 / -1;
  }
  background: rgba(196, 163, 90, 0.06);
  border-color: rgba(196, 163, 90, 0.25);
}

.detailHead {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detailIcon {
  font-size: 0.95rem;
}

.detailLabel {
  font-size: 0.84rem;
  font-weight: 700;
  color: $color-text;
}

.detailContent {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: #d1d5db; // 읽기 편하고 선명한 텍스트 컬러
}
</style>
