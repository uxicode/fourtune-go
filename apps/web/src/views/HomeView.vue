<template>
  <div :class="$style.page">
    <h1 :class="$style.title">사주 팔자 (만세력)</h1>
    <p :class="$style.lead">
      생년월일·시를 입력하면 <strong>년·월·일·시</strong> 네 기둥을 manseryeok 엔진으로
      보여드립니다. 풀이는 참고·오락용입니다.
    </p>
    <DisclaimerBlock />
    <RouterLink to="/input" :class="$style.cta">시작하기</RouterLink>
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
  gap: 1.25rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.03em;
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

.cta {
  display: inline-block;
  align-self: flex-start;
  padding: 0.65rem 1.1rem;
  background: $color-accent;
  color: $color-bg;
  text-decoration: none;
  font-weight: 600;
  border-radius: $radius;
  font-size: 0.95rem;
  &:hover {
    filter: brightness(1.08);
  }
}
</style>
