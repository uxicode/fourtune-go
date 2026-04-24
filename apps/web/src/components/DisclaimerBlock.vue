<template>
  <aside :class="$style.box" role="note">
    <h2 :class="$style.heading">면책 (고지)</h2>
    <p :class="$style.p">
      본 서비스는
      <strong>참고·오락 목적</strong>으로 제공됩니다. 건강, 재정, 법률, 고용·승진 등
      <strong>중요한 판단의 근거</strong>로 사용하지 마세요. manseryeok
      (v{{ mVersion }}) 엔진 기준이며, 전통 사주 풀이 중 여러 가지 학파가
      있을 수 있습니다.
    </p>
    <p :class="$style.v">disclaimer v{{ versionLabel }}</p>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DEFAULT_DISCLAIMER_VERSION, MANSERYEOK_VERSION } from "@/constants/engine"

const props = defineProps<{
  version?: string
}>()

const versionLabel = computed(() => props.version ?? DEFAULT_DISCLAIMER_VERSION)
const mVersion = MANSERYEOK_VERSION
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.box {
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 1rem;
  background: $color-surface;
}

.heading {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $color-muted;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: $color-text;
}

.v {
  margin: 0.75rem 0 0;
  font-size: 0.7rem;
  color: $color-muted;
}
</style>
