<template>
  <div v-if="chart" :class="$style.page">
    <div :class="$style.topNav">
      <div :class="$style.titleWrap">
        <h1 :class="$style.title">사주 결과 분석</h1>
        <div :class="$style.modeBadgeWrap">
          <span v-if="activeMode === 'a'" :class="$style.modeBadgeA">Mode A · 무료 맛보기</span>
          <span v-else :class="$style.modeBadgeB">Mode B · VIP 정밀 분석</span>
        </div>
      </div>

      <div :class="$style.topActions">
        <!-- 모드 전환 탭/토글 버튼 -->
        <button
          v-if="activeMode === 'a'"
          type="button"
          :class="$style.upgradeBtn"
          :disabled="store.isLoading"
          @click="handleUpgrade"
        >
          <span v-if="store.isLoading">전환 중…</span>
          <span v-else>🔮 VIP Mode B로 보기</span>
        </button>
        <button
          v-else
          type="button"
          :class="$style.switchBtn"
          @click="switchMode('a')"
        >
          무료 Mode A로 보기
        </button>

        <RouterLink to="/input" :class="$style.link">다시 입력</RouterLink>
      </div>
    </div>

    <!-- 1. 사주 보드 (사주팔자·오행 등) - Mode A & B 공통 -->
    <SajuPillarBoard :chart="chart" />

    <!-- ==================== Mode A (무료 맛보기) ==================== -->
    <template v-if="activeMode === 'a'">
      <!-- 2. 한 줄 총평 수준의 맛보기 -->
      <FreeResultPreview
        v-if="chart.easyInterpretation"
        :one-line-summary="chart.easyInterpretation.oneLineSummary"
        :keywords="chart.easyInterpretation.keywords"
      />

      <!-- 3. 올해 간략 운세만 (총운·월별과 겹치지 않는 포인트형) -->
      <YearlyBriefCard
        v-if="chart.yearlyBrief"
        :brief="chart.yearlyBrief"
      />

      <!-- 4. 결정 타이밍 (이직·계약·이사) — Mode A에서도 제공 -->
      <DecisionTimingCard
        v-if="chart.decisionTiming"
        :timing="chart.decisionTiming"
      />

      <!-- 5. 유료 전환 CTA 배너 (종합 풀이 및 월별 운세 잠금 안내) -->
      <PaywallBanner
        :is-loading="store.isLoading"
        @upgrade="handleUpgrade"
      />
    </template>

    <!-- ==================== Mode B (유료 정밀 분석) ==================== -->
    <template v-else>
      <!-- 2. 올해 총운 상세 카드 -->
      <YearlyFortuneCard
        v-if="chart.yearlyFortuneDetail"
        :detail="chart.yearlyFortuneDetail"
      />

      <!-- 3. 12개월 월별 운세 카드 -->
      <MonthlyFortuneCard
        v-if="chart.monthlyFortunes"
        :months="chart.monthlyFortunes"
        :on-refresh="handleUpgrade"
        @refresh="handleUpgrade"
      />

      <!-- 4. 결정 타이밍 (이직·계약·이사) -->
      <DecisionTimingCard
        v-if="chart.decisionTiming"
        :timing="chart.decisionTiming"
      />

      <!-- 5. 올해 간략 포인트 운세도 함께 열람 가능 -->
      <YearlyBriefCard
        v-if="chart.yearlyBrief"
        :brief="chart.yearlyBrief"
      />

      <!-- 5. 알기 쉬운 사주 종합 풀이 전체 리포트 -->
      <EasyInterpretationCard
        v-if="chart.easyInterpretation"
        :easy="chart.easyInterpretation"
      />

      <!-- 6. 상세 명리학 지표 및 원국 분석 (펼쳐보기) -->
      <details :class="$style.expertDetails">
        <summary :class="$style.expertSummary">
          🔍 상세 명리학 원국 및 만세력 지표 (펼쳐보기)
        </summary>

        <div :class="$style.expertContent">
          <!-- 일주(60갑자) 참고 -->
          <section v-if="chart.content?.dayGanzhi60" :class="$style.block">
            <h2 :class="$style.h2">일주(60갑자 원문 사전)</h2>
            <p :class="$style.kicker">{{ chart.content.dayGanzhi60.title }}</p>
            <p :class="$style.p">{{ chart.content.dayGanzhi60.body }}</p>
            <p v-if="chart.content.dayGanzhi60.tags.length" :class="$style.tags">
              {{ chart.content.dayGanzhi60.tags.join(" ") }}
            </p>
          </section>

          <!-- 십성 키워드 -->
          <section v-if="chart.content" :class="$style.block">
            <h2 :class="$style.h2">기둥별 십성 키워드 (천간/지·본기)</h2>
            <ul :class="$style.ulTight">
              <li v-for="row in sipsinRows" :key="row.label">
                <strong :class="$style.strongLabel">{{ row.label }} 기둥</strong>
                <br />
                천간: [{{ row.stemKeywords }}] {{ row.stemMeaning }}
                <br />
                지(본기): [{{ row.branchKeywords }}] {{ row.branchMeaning }}
              </li>
            </ul>
          </section>

          <!-- 신강 / 신약 -->
          <section :class="$style.block">
            <h2 :class="$style.h2">신강 / 신약 판정</h2>
            <p :class="$style.p">
              {{ chart.strength.level }} (점수 {{ chart.strength.score.toFixed(1) }})
            </p>
            <ul :class="$style.ul">
              <li v-for="(r, i) in chart.strength.reasons" :key="i">{{ r }}</li>
            </ul>
          </section>

          <!-- 대운 -->
          <section :class="$style.block">
            <h2 :class="$style.h2">대운 (10년 주기 큰 흐름)</h2>
            <p :class="$style.p">
              {{ chart.daeun.forward ? "순행" : "역행" }}, 첫 대운 약 {{ chart.daeun.firstStartAge }}세
            </p>
            <ul :class="$style.ul">
              <li v-for="d in chart.daeun.steps" :key="d.order">
                {{ d.order }}운 {{ d.ganzhi }} (만 {{ d.fromAge }}~{{ d.toAge }}세)
              </li>
            </ul>
          </section>

          <!-- 세운 -->
          <section :class="$style.block">
            <h2 :class="$style.h2">세운 (올해부터 6년)</h2>
            <ul :class="$style.ul">
              <li v-for="e in chart.saeun" :key="e.year">
                {{ e.year }}년 {{ e.ganzhi }} — 천간 {{ e.stemSipsung }} / 지(본기) {{ e.branchSipsung }}
              </li>
            </ul>
          </section>

          <!-- 전체 격국 참고 사전 -->
          <section v-if="chart.content" :class="$style.block">
            <h2 :class="$style.h2">격국 14종 분류 참고 사전</h2>
            <details
              v-for="g in chart.content.gejuReference"
              :key="g.code"
              :class="$style.subDetails"
            >
              <summary :class="$style.subSummary">{{ g.code }} — {{ g.name }}</summary>
              <p :class="$style.detailBody">{{ g.description }}</p>
            </details>
          </section>

          <!-- 종합 풀이 원문 텍스트 -->
          <section :class="$style.interpret">
            <h2 :class="$style.h2">종합 풀이 원문 텍스트 (복사용)</h2>
            <pre :class="$style.pre">{{ chart.interpretation }}</pre>
          </section>
        </div>
      </details>
    </template>

    <DisclaimerBlock :version="chart.disclaimerVersion" />

    <p :class="$style.meta">
      엔진: {{ chart.engineVersion }}
    </p>

    <div :class="$style.actions">
      <RouterLink to="/input" :class="$style.link">다시 입력</RouterLink>
      <RouterLink to="/" :class="$style.linkMuted">홈</RouterLink>
    </div>
  </div>

  <div v-else :class="$style.empty">
    <p>결과가 없습니다. 입력 화면에서 사주를 먼저 계산해 주세요.</p>
    <RouterLink to="/input" :class="$style.link">입력하기</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import SajuPillarBoard from "@/components/SajuPillarBoard.vue"
import EasyInterpretationCard from "@/components/EasyInterpretationCard.vue"
import FreeResultPreview from "@/components/FreeResultPreview.vue"
import YearlyBriefCard from "@/components/YearlyBriefCard.vue"
import YearlyFortuneCard from "@/components/YearlyFortuneCard.vue"
import MonthlyFortuneCard from "@/components/MonthlyFortuneCard.vue"
import PaywallBanner from "@/components/PaywallBanner.vue"
import DisclaimerBlock from "@/components/DisclaimerBlock.vue"
import DecisionTimingCard from "@/components/DecisionTimingCard.vue"
import { useSajuStore } from "@/stores/saju"
import type { FortuneMode, SajuContentDto } from "@/types/chart"

const route = useRoute()
const router = useRouter()
const store = useSajuStore()
const chart = computed(() => store.lastResult)

// 현재 활성화된 모드 (URL query ?mode=a|b 우선, 없으면 chart.mode, 없으면 store.currentMode)
const activeMode = computed<FortuneMode>(() => {
  const qMode = route.query.mode as string | undefined
  if (qMode === "a" || qMode === "b") return qMode
  return chart.value?.mode ?? store.currentMode
})

// 이전 캐시 응답으로 인해 월별 상세 필드가 누락되어 있는 경우 자동 최신화
onMounted(async () => {
  if (
    activeMode.value === "b" &&
    chart.value?.monthlyFortunes &&
    chart.value.monthlyFortunes[0] &&
    !chart.value.monthlyFortunes[0].career &&
    store.lastInput
  ) {
    await store.upgradeToPaid()
  }
})

async function switchMode(mode: FortuneMode) {
  store.setMode(mode)
  await router.replace({ query: { ...route.query, mode } })
  // 모드 B로 전환하는데 필요한 데이터가 없으면 다시 요청
  if (mode === "b" && (!chart.value?.yearlyFortuneDetail || !chart.value?.monthlyFortunes)) {
    await store.upgradeToPaid()
  }
}

async function handleUpgrade() {
  await store.upgradeToPaid()
  await router.replace({ query: { ...route.query, mode: "b" } })
}

const sipsinRows = computed(() => {
  const c = chart.value?.content
  if (!c) return []
  const b = c.sipsinBlurbs
  const from = (label: string, k: keyof SajuContentDto["sipsinBlurbs"]) => ({
    label,
    stemKeywords: b[k].stem.keywords,
    stemMeaning: b[k].stem.socialMeaning,
    branchKeywords: b[k].branch.keywords,
    branchMeaning: b[k].branch.socialMeaning,
  })
  return [
    from("년", "year"),
    from("월", "month"),
    from("일", "day"),
    from("시", "hour"),
  ] as const
})
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.topNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.titleWrap {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.title {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
  color: $color-text;
}

.modeBadgeWrap {
  display: flex;
}

.modeBadgeA {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: rgba(139, 143, 154, 0.2);
  color: $color-muted;
  border-radius: 999px;
  border: 1px solid rgba(139, 143, 154, 0.3);
}

.modeBadgeB {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  background: rgba(196, 163, 90, 0.2);
  color: $color-accent;
  border-radius: 999px;
  border: 1px solid rgba(196, 163, 90, 0.4);
}

.topActions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upgradeBtn {
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  background: $color-accent;
  color: $color-bg;
  border: none;
  border-radius: $radius;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.switchBtn {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.4rem 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  color: $color-muted;
  border: 1px solid $color-border;
  border-radius: $radius;
  cursor: pointer;

  &:hover {
    color: $color-text;
  }
}

.block {
  margin: 0;
}

.p {
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.ul {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.82rem;
  color: $color-muted;
  line-height: 1.5;
}

.h2 {
  font-size: 0.85rem;
  color: $color-muted;
  margin: 0 0 0.35rem;
  font-weight: 600;
}

.kicker {
  font-size: 0.8rem;
  color: $color-accent;
  margin: 0 0 0.25rem;
}

.tags {
  font-size: 0.75rem;
  color: $color-muted;
  margin: 0.35rem 0 0;
}

.ulTight {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: $color-muted;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.strongLabel {
  color: $color-text;
}

.expertDetails {
  border: 1px solid $color-border;
  border-radius: $radius;
  background: $color-surface;
  padding: 0.75rem 1rem;
}

.expertSummary {
  font-size: 0.92rem;
  font-weight: 600;
  color: $color-accent;
  cursor: pointer;
  user-select: none;
}

.expertContent {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.subDetails {
  margin-top: 0.35rem;
  font-size: 0.82rem;
}

.subSummary {
  cursor: pointer;
  color: $color-text;
}

.detailBody {
  margin: 0.35rem 0 0;
  color: $color-muted;
  line-height: 1.45;
}

.interpret {
  margin: 0;
}

.pre {
  margin: 0;
  font-family: inherit;
  font-size: 0.8rem;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-all;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.75rem;
  border-radius: $radius;
  border: 1px solid $color-border;
  color: $color-muted;
  max-height: 320px;
  overflow-y: auto;
}

.meta {
  font-size: 0.75rem;
  color: $color-muted;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.link {
  font-size: 0.9rem;
  color: $color-accent;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.linkMuted {
  font-size: 0.85rem;
  color: $color-muted;
  text-decoration: none;
  &:hover {
    color: $color-text;
  }
}

.empty {
  padding: 2rem 0;
  p {
    margin: 0 0 1rem;
    color: $color-muted;
  }
}
</style>
