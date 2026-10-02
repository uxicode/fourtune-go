import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { CalendarKind, ChartRequestInput, ChartWithInterpretation, FortuneMode, Gender } from "@/types/chart"
import { useSajuChart } from "@/composables/useSajuChart"

export interface SajuSubmitInput {
  kind: CalendarKind
  year: number
  month: number
  day: number
  hour: number
  minute: number
  isLeapMonth: boolean
  timeUnknown: boolean
  gender: Gender
  mode?: FortuneMode
}

export const useSajuStore = defineStore("saju", () => {
  const lastResult = ref<ChartWithInterpretation | null>(null)
  const lastError = ref<string | null>(null)
  const currentMode = ref<FortuneMode>("a")
  const lastInput = ref<SajuSubmitInput | null>(null)
  const { isLoading, error, run } = useSajuChart()

  const hasResult = computed(() => lastResult.value !== null)
  const displayError = computed(() => lastError.value ?? error.value)

  function setMode(mode: FortuneMode) {
    currentMode.value = mode
  }

  async function submit(input: SajuSubmitInput): Promise<boolean> {
    lastError.value = null
    const mode = input.mode ?? currentMode.value
    currentMode.value = mode
    lastInput.value = { ...input, mode }

    const body: ChartRequestInput = {
      kind: input.kind,
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute,
      timeUnknown: input.timeUnknown,
      gender: input.gender,
      saeunFromYear: new Date().getFullYear(),
      mode,
      ...(input.kind === "lunar" ? { isLeapMonth: input.isLeapMonth } : {}),
    }
    const res = await run(body)
    if (res) {
      lastResult.value = res
      return true
    }
    lastError.value = error.value
    return false
  }

  async function upgradeToPaid(): Promise<boolean> {
    if (!lastInput.value) return false
    return submit({
      ...lastInput.value,
      mode: "b",
    })
  }

  function clear() {
    lastResult.value = null
    lastError.value = null
    lastInput.value = null
  }

  return {
    lastResult,
    lastInput,
    isLoading,
    currentMode,
    hasResult,
    displayError,
    error,
    setMode,
    submit,
    upgradeToPaid,
    clear,
  }
})

