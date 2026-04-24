import { ref, type Ref } from "vue"
import type { ChartRequestInput, ChartWithInterpretation } from "@/types/chart"

const base = import.meta.env.VITE_API_BASE ?? ""

export function useSajuChart(): {
  isLoading: Ref<boolean>
  error: Ref<string | null>
  run: (body: ChartRequestInput) => Promise<ChartWithInterpretation | null>
} {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function run(
    body: ChartRequestInput
  ): Promise<ChartWithInterpretation | null> {
    isLoading.value = true
    error.value = null
    try {
      const r = await fetch(`${base}/v1/charts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string }
        error.value = j.error ?? `오류 ${r.status}`
        return null
      }
      return (await r.json()) as ChartWithInterpretation
    } catch (e) {
      error.value = e instanceof Error ? e.message : "네트워크 오류"
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, run }
}
