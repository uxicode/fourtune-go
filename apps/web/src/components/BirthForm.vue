<template>
  <form :class="$style.form" @submit.prevent="onSubmit(selectedMode)">
    <!-- 서비스 모드 선택 -->
    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">분석 모드 선택</legend>
      <div :class="$style.modeSelection">
        <label :class="[$style.modeCard, selectedMode === 'a' && $style.modeCardActive]">
          <input
            v-model="selectedMode"
            type="radio"
            value="a"
            :disabled="isLoading"
            :class="$style.hiddenRadio"
          />
          <div :class="$style.modeHeader">
            <span :class="$style.modeIcon">🌱</span>
            <span :class="$style.modeTitle">Mode A (무료 맛보기)</span>
          </div>
          <p :class="$style.modeDesc">
            사주 보드 + 한 줄 총평 + 올해 간략 운세
          </p>
        </label>

        <label :class="[$style.modeCard, selectedMode === 'b' && $style.modeCardActive]">
          <input
            v-model="selectedMode"
            type="radio"
            value="b"
            :disabled="isLoading"
            :class="$style.hiddenRadio"
          />
          <div :class="$style.modeHeader">
            <span :class="$style.modeIcon">🔮</span>
            <span :class="$style.modeTitle">Mode B (VIP 정밀 분석)</span>
          </div>
          <p :class="$style.modeDesc">
            올해 총운 + 12개월 운세 + 12종 종합 심층 풀이
          </p>
        </label>
      </div>
    </fieldset>

    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">양력 / 음력 & 성별</legend>
      <div :class="$style.row">
        <label>
          력
          <select v-model="kind" :disabled="isLoading">
            <option value="solar">양력</option>
            <option value="lunar">음력</option>
          </select>
        </label>

        <label v-if="kind === 'lunar'">
          윤달
          <input v-model="isLeapMonth" type="checkbox" :disabled="isLoading" />
        </label>

        <label>
          성별
          <select v-model="gender" :disabled="isLoading">
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </label>
      </div>
    </fieldset>

    <fieldset :class="$style.fieldset">
      <legend :class="$style.legend">생년월일</legend>
      <div :class="$style.grid">
        <label>
          년
          <input v-model.number="year" type="number" min="1900" max="2100" required :disabled="isLoading" />
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
      <legend :class="$style.legend">태어난 시각</legend>
      <label :class="$style.row">
        <span>시간 모름</span>
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

    <!-- 듀얼 제출 버튼 -->
    <div :class="$style.buttonRow">
      <button
        type="button"
        :class="[$style.submit, $style.submitA]"
        :disabled="isLoading"
        @click="onSubmit('a')"
      >
        <span v-if="isLoading && targetMode === 'a'">계산 중…</span>
        <span v-else>🌱 무료 맛보기 시작 (Mode A)</span>
      </button>

      <button
        type="button"
        :class="[$style.submit, $style.submitB]"
        :disabled="isLoading"
        @click="onSubmit('b')"
      >
        <span v-if="isLoading && targetMode === 'b'">정밀 분석 중…</span>
        <span v-else>🔮 VIP 정밀 분석 시작 (Mode B)</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { CalendarKind, FortuneMode, Gender } from "@/types/chart"

const props = defineProps<{
  isLoading: boolean
  errorText: string | null
  initialMode?: FortuneMode
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
      mode: FortuneMode
    },
  ]
}>()

const selectedMode = ref<FortuneMode>(props.initialMode ?? "a")
const targetMode = ref<FortuneMode>("a")

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

function onSubmit(mode: FortuneMode) {
  message.value = ""
  targetMode.value = mode
  selectedMode.value = mode
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
    mode,
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

.modeSelection {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }
}

.hiddenRadio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.modeCard {
  border: 1px solid $color-border;
  border-radius: $radius;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.02);
  }
}

.modeCardActive {
  border-color: $color-accent !important;
  background: rgba(196, 163, 90, 0.1) !important;
}

.modeHeader {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.modeIcon {
  font-size: 1.05rem;
}

.modeTitle {
  font-size: 0.88rem;
  font-weight: 700;
  color: $color-text;
}

.modeDesc {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
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

.buttonRow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }
}

.submit {
  padding: 0.8rem 1rem;
  border: none;
  border-radius: $radius;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
}

.submitA {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid $color-border;
  color: $color-text;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
}

.submitB {
  background: linear-gradient(135deg, $color-accent, #dfbe72);
  color: #12141a;
}
</style>
