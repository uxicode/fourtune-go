import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { CalendarKind, ChartRequestInput, ChartWithInterpretation, Gender } from "@/types/chart"
import { useSajuChart } from "@/composables/useSajuChart"

export const useSajuStore = defineStore("saju", () => {
  const lastResult = ref<ChartWithInterpretation | null>(null)
  const lastError = ref<string | null>(null)
  const { isLoading, error, run } = useSajuChart()

  const hasResult = computed(() => lastResult.value !== null)
  const displayError = computed(() => lastError.value ?? error.value)

  async function submit(input: {
    kind: CalendarKind
    year: number
    month: number
    day: number
    hour: number
    minute: number
    isLeapMonth: boolean
    timeUnknown: boolean
    gender: Gender
  }): Promise<boolean> {
    lastError.value = null
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

  function clear() {
    lastResult.value = null
    lastError.value = null
  }

  return {
    lastResult,
    isLoading,
    hasResult,
    displayError,
    error,
    submit,
    clear,
  }
})
