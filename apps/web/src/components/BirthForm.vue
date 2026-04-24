<template>
  <form :class="$style.form" @submit.prevent="onSubmit">
    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">달력</legend>
      <label :class="$style.row">
        <span>종류</span>
        <select v-model="kind" :disabled="isLoading">
          <option value="solar">양력</option>
          <option value="lunar">음력</option>
        </select>
      </label>
      <label v-if="kind === 'lunar'" :class="$style.row">
        <span>윤달</span>
        <input v-model="isLeapMonth" type="checkbox" :disabled="isLoading" />
      </label>
    </fieldset>

    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">성별 (대운 순·역)</legend>
      <div :class="$style.row">
        <span>성별</span>
        <select v-model="gender" :disabled="isLoading" required>
          <option value="male">남</option>
          <option value="female">여</option>
        </select>
      </div>
    </fieldset>

    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">생년월일</legend>
      <div :class="$style.grid">
        <label>
          연 (1900–2100)
          <input
            v-model.number="year"
            type="number"
            min="1900"
            max="2100"
            required
            :disabled="isLoading"
          />
        </label>
        <label>
          월
          <input v-model.number="month" type="number" min="1" max="12" required :disabled="isLoading" />
        </label>
        <label>
          일
          <input v-model.number="day" type="number" min="1" max="31" required :disabled="isLoading" />
        </label>
      </div>
    </fieldset>

    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">시간</legend>
      <label :class="$style.row">
        <span>출생 시각을 모름</span>
        <input v-model="timeUnknown" type="checkbox" :disabled="isLoading" />
      </label>
      <p v-if="timeUnknown" :class="$style.hint">
        정오(12:00, 오시)로 산출합니다. 실제 시각과 다를 수 있습니다.
      </p>
      <div v-else :class="$style.grid">
        <label>
          시 (0–23)
          <input v-model.number="hour" type="number" min="0" max="23" required :disabled="isLoading" />
        </label>
        <label>
          분 (0–59)
          <input v-model.number="minute" type="number" min="0" max="59" required :disabled="isLoading" />
        </label>
      </div>
    </fieldset>

    <p v-if="message" :class="$style.err">{{ message }}</p>

    <button type="submit" :class="$style.submit" :disabled="isLoading">
      {{ isLoading ? "계산 중…" : "사주 보기" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { CalendarKind, Gender } from "@/types/chart"

const props = defineProps<{
  isLoading: boolean
  errorText: string | null
}>()

const emit = defineEmits<{
  submit: [
    {
      kind: CalendarKind
      year: number
      month: number
      day: number
      hour: number
      minute: number
      isLeapMonth: boolean
      timeUnknown: boolean
      gender: Gender
    },
  ]
}>()

const kind = ref<CalendarKind>("solar")
const year = ref(1992)
const month = ref(10)
const day = ref(24)
const hour = ref(5)
const minute = ref(30)
const isLeapMonth = ref(false)
const timeUnknown = ref(false)
const gender = ref<Gender>("male")

const message = ref("")

watch(
  () => props.errorText,
  (e) => {
    message.value = e ?? ""
  }
)

function onSubmit() {
  message.value = ""
  emit("submit", {
    kind: kind.value,
    year: year.value,
    month: month.value,
    day: day.value,
    hour: timeUnknown.value ? 0 : hour.value,
    minute: timeUnknown.value ? 0 : minute.value,
    isLeapMonth: kind.value === "lunar" ? isLeapMonth.value : false,
    timeUnknown: timeUnknown.value,
    gender: gender.value,
  })
}
</script>

<style module lang="scss">
@use "@/styles/variables" as *;

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fieldset {
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 0.85rem 1rem;
  margin: 0;
}

.legend {
  padding: 0 0.35rem;
  font-size: 0.75rem;
  color: $color-muted;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
  select {
    min-width: 8rem;
    padding: 0.35rem 0.5rem;
    border-radius: $radius;
    border: 1px solid $color-border;
    background: $color-bg;
    color: $color-text;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr));
  gap: 0.75rem;
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: $color-muted;
  }
  input[type="number"] {
    padding: 0.4rem 0.5rem;
    border-radius: $radius;
    border: 1px solid $color-border;
    background: $color-bg;
    color: $color-text;
  }
}

.hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: $color-muted;
  line-height: 1.45;
}

.err {
  margin: 0;
  color: $color-danger;
  font-size: 0.85rem;
}

.submit {
  padding: 0.65rem 1rem;
  border: none;
  border-radius: $radius;
  background: $color-accent;
  color: $color-bg;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    filter: brightness(1.08);
  }
}
</style>
