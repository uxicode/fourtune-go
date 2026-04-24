<template>
  <div :class="$style.page">
    <h1 :class="$style.title">생년월일 입력</h1>
    <BirthForm
      :is-loading="store.isLoading"
      :error-text="store.displayError"
      @submit="onSubmit"
    />
    <RouterLink to="/" :class="$style.back">← 처음으로</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import BirthForm from "@/components/BirthForm.vue"
import { useSajuStore } from "@/stores/saju"
import type { CalendarKind, Gender } from "@/types/chart"

const router = useRouter()
const store = useSajuStore()

async function onSubmit(payload: {
  kind: CalendarKind
  year: number
  month: number
  day: number
  hour: number
  minute: number
  isLeapMonth: boolean
  timeUnknown: boolean
  gender: Gender
}) {
  const ok = await store.submit(payload)
  if (ok) await router.push({ name: "result" })
}
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
}

.back {
  font-size: 0.85rem;
  color: $color-muted;
  text-decoration: none;
  &:hover {
    color: $color-accent;
  }
}
</style>
