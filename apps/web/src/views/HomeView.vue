<template>
  <div :class="$style.page">
    <h1 :class="$style.title">전통 명리학 사주 분석</h1>
    <p :class="$style.lead">
      생년월일·시를 입력하면 정통 만세력 엔진을 기반으로 <strong>년·월·일·시</strong> 네 기둥 원국과 오행 밸런스, 인생의 운 흐름을 명쾌하게 풀어드립니다.
    </p>

    <!-- 모드 비교 카드 그리드 -->
    <div :class="$style.modeCards">
      <!-- Mode A 무료 맛보기 -->
      <div :class="$style.card">
        <div :class="$style.cardHead">
          <span :class="$style.badgeA">무료 체험</span>
          <h2 :class="$style.cardTitle">Mode A · 무료 맛보기</h2>
        </div>
        <p :class="$style.cardDesc">
          나의 사주팔자 기본 원국과 핵심 키워드, 올해의 간략 포인트를 가볍게 확인하세요.
        </p>
        <ul :class="$style.featureList">
          <li>✅ 사주팔자 4기둥 보드 & 오행 분석</li>
          <li>✅ 한 줄 총평 & 핵심 성향 키워드</li>
          <li>✅ 올해 세운 기반 간략 포인트 운세</li>
        </ul>
        <RouterLink :to="{ path: '/input', query: { mode: 'a' } }" :class="[$style.cta, $style.ctaA]">
          무료로 시작하기
        </RouterLink>
      </div>

      <!-- Mode B VIP 정밀 분석 -->
      <div :class="[$style.card, $style.cardPremium]">
        <div :class="$style.cardHead">
          <span :class="$style.badgeB">추천 · VIP</span>
          <h2 :class="$style.cardTitle">Mode B · 정밀 심층 분석</h2>
        </div>
        <p :class="$style.cardDesc">
          올해 총운 심층 리포트와 12개월 월별 운세, 12종 종합 풀이 전체를 열람하세요.
        </p>
        <ul :class="$style.featureList">
          <li>✨ <strong>올해 총운 심층 리포트</strong> (직업·재물·애정·건강)</li>
          <li>✨ <strong>12개월 월별 운세</strong> (매월 운세지수 & 가이드)</li>
          <li>✨ <strong>12종 종합 심층 풀이</strong> (성향, 격국, 개운법 등)</li>
          <li>✨ 대운·세운 및 전문 만세력 원국 지표</li>
        </ul>
        <RouterLink :to="{ path: '/input', query: { mode: 'b' } }" :class="[$style.cta, $style.ctaB]">
          🔮 VIP 분석 시작하기
        </RouterLink>
      </div>
    </div>

    <DisclaimerBlock />
  </div>
</template>

<script setup lang="ts">
import DisclaimerBlock from "@/components/DisclaimerBlock.vue"
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.03em;
  color: $color-text;
}

.lead {
  margin: 0;
  line-height: 1.6;
  color: $color-muted;
  font-size: 0.95rem;
  strong {
    color: $color-text;
  }
}

.modeCards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  justify-content: space-between;
}

.cardPremium {
  border-color: rgba(196, 163, 90, 0.4);
  background: linear-gradient(145deg, rgba(26, 29, 36, 0.98), rgba(35, 30, 20, 0.98));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.cardHead {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.badgeA {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: $color-muted;
  border-radius: 999px;
}

.badgeB {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  background: $color-accent;
  color: $color-bg;
  border-radius: 999px;
}

.cardTitle {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: $color-text;
}

.cardDesc {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: $color-muted;
}

.featureList {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: $color-text;

  strong {
    color: $color-accent;
  }
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  font-weight: 700;
  border-radius: $radius;
  font-size: 0.9rem;
  transition: all 0.15s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
}

.ctaA {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid $color-border;
  color: $color-text;
}

.ctaB {
  background: linear-gradient(135deg, $color-accent, #dfbe72);
  color: #12141a;
}
</style>
