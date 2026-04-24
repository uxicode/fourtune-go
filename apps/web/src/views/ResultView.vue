<template>
  <div v-if="chart" :class="$style.page">
    <h1 :class="$style.title">사주 결과</h1>
    <SajuPillarBoard :chart="chart" />
    <section v-if="chart.content" :class="$style.block">
      <h2 :class="$style.h2">일주(60갑자, 참고)</h2>
      <template v-if="chart.content.dayGanzhi60">
        <p :class="$style.kicker">{{ chart.content.dayGanzhi60.title }}</p>
        <p :class="$style.p">{{ chart.content.dayGanzhi60.body }}</p>
        <p v-if="chart.content.dayGanzhi60.tags.length" :class="$style.tags">
          {{ chart.content.dayGanzhi60.tags.join(" ") }}
        </p>
      </template>
      <p v-else :class="$style.noteMuted">이 날의 일주 키에 맞는 60갑자 문구가 없어 생략되었습니다.</p>
    </section>
    <section v-if="chart.content" :class="$style.block">
      <h2 :class="$style.h2">십성 키워드(기둥별, 천간/지·본기)</h2>
      <ul :class="$style.ulTight">
        <li
          v-for="row in sipsinRows"
          :key="row.label"
        >
          <strong :class="$style.strongLabel">{{ row.label }}</strong>
          <br />
          천간: [{{ row.stemKeywords }}] {{ row.stemMeaning }}
          <br />
          지(본기): [{{ row.branchKeywords }}] {{ row.branchMeaning }}
        </li>
      </ul>
    </section>
    <section v-if="chart.content" :class="$style.block">
      <h2 :class="$style.h2">격국 참고(자동 판정 없음)</h2>
      <p :class="$style.noteMuted">아래는 전부 참고용이며, 전통 격 판정과 다를 수 있습니다.</p>
      <details
        v-for="g in chart.content.gejuReference"
        :key="g.code"
        :class="$style.details"
      >
        <summary :class="$style.summary">{{ g.code }} — {{ g.name }}</summary>
        <p :class="$style.detailBody">{{ g.description }}</p>
      </details>
    </section>
    <section :class="$style.block">
      <h2 :class="$style.h2">신강 / 신약 (참고)</h2>
      <p :class="$style.p">
        {{ chart.strength.level }} (점수 {{ chart.strength.score.toFixed(1) }})
      </p>
      <ul :class="$style.ul">
        <li v-for="(r, i) in chart.strength.reasons" :key="i">{{ r }}</li>
      </ul>
    </section>
    <section :class="$style.block">
      <h2 :class="$style.h2">대운</h2>
      <p :class="$style.p">
        {{ chart.daeun.forward ? "순행" : "역행" }}, 첫 대운 약 {{ chart.daeun.firstStartAge }}세
      </p>
      <ul :class="$style.ul">
        <li v-for="d in chart.daeun.steps" :key="d.order">
          {{ d.order }}운 {{ d.ganzhi }} (만 {{ d.fromAge }}~{{ d.toAge }}세)
        </li>
      </ul>
    </section>
    <section :class="$style.block">
      <h2 :class="$style.h2">세운 (올해부터 6년)</h2>
      <ul :class="$style.ul">
        <li v-for="e in chart.saeun" :key="e.year">
          {{ e.year }}년 {{ e.ganzhi }} — 천간 {{ e.stemSipsung }} / 지(본기)
          {{ e.branchSipsung }}
        </li>
      </ul>
    </section>
    <section :class="$style.interpret">
      <h2 :class="$style.h2">참고 풀이</h2>
      <pre :class="$style.pre">{{ chart.interpretation }}</pre>
    </section>
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
import { computed } from "vue"
import SajuPillarBoard from "@/components/SajuPillarBoard.vue"
import DisclaimerBlock from "@/components/DisclaimerBlock.vue"
import { useSajuStore } from "@/stores/saju"
import type { SajuContentDto } from "@/types/chart"

const store = useSajuStore()
const chart = computed(() => store.lastResult)

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

.title {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
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

.interpret {
  margin: 0;
}

.h2 {
  font-size: 0.85rem;
  color: $color-muted;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: $font-sans;
  font-size: 0.88rem;
  line-height: 1.6;
  color: $color-text;
}

.meta {
  margin: 0;
  font-size: 0.72rem;
  color: $color-muted;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.link {
  color: $color-accent;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.linkMuted {
  color: $color-muted;
  font-size: 0.9rem;
  text-decoration: none;
}

.empty {
  text-align: center;
  padding: 2rem 0;
  color: $color-muted;
  p {
    margin: 0 0 1rem;
  }
}

.kicker {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: $color-text;
}

.tags {
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: $color-muted;
  line-height: 1.5;
}

.ulTight {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.82rem;
  color: $color-text;
  line-height: 1.55;
  li {
    margin-bottom: 0.75rem;
  }
}

.strongLabel {
  font-weight: 600;
  color: $color-text;
}

.noteMuted {
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0 0 0.5rem;
  color: $color-muted;
}

.detailBody {
  margin: 0.35rem 0 0.75rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: $color-muted;
}

.summary {
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: $color-text;
}

.details {
  margin-bottom: 0.35rem;
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  padding-left: 0.5rem;
}
</style>
