<template>
  <div :class="$style.paywall">
    <div :class="$style.lockIconWrap">
      <span :class="$style.lockIcon">🔒</span>
    </div>

    <div :class="$style.content">
      <span :class="$style.badge">VIP 정밀 분석 (Mode B)</span>
      <h3 :class="$style.title">전체 사주 풀이와 12개월 운세가 잠겨있습니다</h3>
      <p :class="$style.desc">
        지금 모드 B(유료)로 전환하시면 내 사주의 깊은 본질부터 올해 총운, 매월 최적의 행동 타이밍까지 모두 확인하실 수 있습니다.
      </p>

      <ul :class="$style.featureList">
        <li>
          <span :class="$style.checkIcon">✨</span>
          <span><strong>12종 종합 심층 풀이</strong> (성향, 격국, 직업, 재물, 애정, 건강, 개운 처방)</span>
        </li>
        <li>
          <span :class="$style.checkIcon">✨</span>
          <span><strong>올해 총운 심층 리포트</strong> (직업·재물·애정·건강운 및 상·하반기 골든타임)</span>
        </li>
        <li>
          <span :class="$style.checkIcon">✨</span>
          <span><strong>12개월 월별 운세 흐름</strong> (매월 운세 지수, 핵심 키워드, 행동 가이드)</span>
        </li>
      </ul>

      <button
        type="button"
        :class="$style.ctaButton"
        :disabled="isLoading"
        @click="$emit('upgrade')"
      >
        <span v-if="isLoading">분석 리포트 생성 중…</span>
        <span v-else>🔮 Mode B 정밀 분석 잠금 해제하기</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading?: boolean
}>()

defineEmits<{
  upgrade: []
}>()
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.paywall {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 29, 36, 0.95), rgba(35, 30, 20, 0.95));
  border: 1px solid rgba(196, 163, 90, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  border-radius: $radius;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(196, 163, 90, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
}

.lockIconWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(196, 163, 90, 0.15);
  border: 1px solid rgba(196, 163, 90, 0.3);
  border-radius: 50%;
}

.lockIcon {
  font-size: 1.25rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  background: $color-accent;
  color: $color-bg;
  border-radius: $radius;
}

.title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: $color-text;
  line-height: 1.4;
}

.desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: $color-muted;
}

.featureList {
  margin: 0.25rem 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    font-size: 0.85rem;
    line-height: 1.45;
    color: $color-text;

    strong {
      color: $color-accent;
    }
  }
}

.checkIcon {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.ctaButton {
  margin-top: 0.5rem;
  padding: 0.8rem 1.25rem;
  background: linear-gradient(135deg, $color-accent, #dfbe72);
  color: #12141a;
  border: none;
  border-radius: $radius;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
