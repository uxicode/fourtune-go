import { describe, expect, it } from "vitest"
import { calculateSajuChart } from "./calculateChart.js"
import { chartWithInterpretation } from "./interpretation.js"

describe("yearlyFortune & mode A/B branching", () => {
  const baseInput = {
    kind: "solar" as const,
    year: 1992,
    month: 10,
    day: 24,
    hour: 5,
    minute: 30,
    timeUnknown: false,
    gender: "male" as const,
  }

  it("Mode A (free): includes yearlyBrief, but does NOT include yearlyFortuneDetail or monthlyFortunes", () => {
    const chart = calculateSajuChart({
      ...baseInput,
      mode: "a",
    })

    expect(chart.mode).toBe("a")
    expect(chart.yearlyBrief).toBeDefined()
    expect(chart.yearlyBrief?.keyTheme).toBeTruthy()
    expect(chart.yearlyBrief?.briefKeypoint).toBeTruthy()
    expect(chart.yearlyBrief?.luckyAction).toBeTruthy()
    expect(chart.yearlyBrief?.cautionAction).toBeTruthy()

    // B모드 전용 필드는 undefined
    expect(chart.yearlyFortuneDetail).toBeUndefined()
    expect(chart.monthlyFortunes).toBeUndefined()

    // 텍스트 interpretation 검증
    const withInterp = chartWithInterpretation({
      ...baseInput,
      mode: "a",
    })
    expect(withInterp.interpretation).toContain("🌱 [사주 맛보기 요약 - 무료 모드 A]")
    expect(withInterp.interpretation).toContain("🔒 [유료 모드 B 전용 콘텐츠]")
  })

  it("Mode B (paid): includes yearlyBrief, yearlyFortuneDetail, and 12 monthly fortunes", () => {
    const chart = calculateSajuChart({
      ...baseInput,
      mode: "b",
    })

    expect(chart.mode).toBe("b")
    expect(chart.yearlyBrief).toBeDefined()

    // B모드 필드 검증
    expect(chart.yearlyFortuneDetail).toBeDefined()
    const detail = chart.yearlyFortuneDetail!
    expect(detail.summary).toBeTruthy()
    expect(detail.careerLuck).toBeTruthy()
    expect(detail.wealthLuck).toBeTruthy()
    expect(detail.relationshipLuck).toBeTruthy()
    expect(detail.healthLuck).toBeTruthy()
    expect(detail.monthlyHighlight).toBeTruthy()

    // 12개월 월별 운세 검증
    expect(chart.monthlyFortunes).toBeDefined()
    expect(chart.monthlyFortunes?.length).toBe(12)
    const scores = new Set<number>()
    chart.monthlyFortunes?.forEach((m, idx) => {
      expect(m.month).toBe(idx + 1)
      expect(m.ganzhi).toBeTruthy()
      expect(m.solarMonthName).toBe(`${idx + 1}월`)
      expect(m.keyword).toBeTruthy()
      expect(m.score).toBeGreaterThanOrEqual(1)
      expect(m.score).toBeLessThanOrEqual(5)
      expect(m.scoreLabel).toBeTruthy()
      expect(m.summary.length).toBeGreaterThan(20)
      expect(m.career.length).toBeGreaterThan(10)
      expect(m.wealth.length).toBeGreaterThan(10)
      expect(m.relationship.length).toBeGreaterThan(10)
      expect(m.advice.length).toBeGreaterThan(10)
      expect(m.summary).not.toContain("평소 계획했던 일을 본격적으로 실행에 옮기기에 아주 유리하며")
      scores.add(m.score)
    })
    // 12달의 점수가 고정 4~5점이 아니라 다양하게 분기(최소 2개 이상의 점수대)
    expect(scores.size).toBeGreaterThanOrEqual(2)

    // 12달의 총평(summary)이 복사-붙여넣기 식이 아니라 각 월마다 고유하게 도출되는지 검증
    const summaries = chart.monthlyFortunes!.map((m) => m.summary)
    const uniqueSummaries = new Set(summaries)
    expect(uniqueSummaries.size).toBe(12)

    // 행동 가이드(advice)도 최소 5가지 이상의 서로 다른 십성별 실천 팁으로 다채롭게 분기
    const advices = chart.monthlyFortunes!.map((m) => m.advice)
    const uniqueAdvices = new Set(advices)
    expect(uniqueAdvices.size).toBeGreaterThanOrEqual(5)

    // 텍스트 interpretation 검증
    const withInterp = chartWithInterpretation({
      ...baseInput,
      mode: "b",
    })
    expect(withInterp.interpretation).toContain("🌟 [알기 쉬운 사주 종합 풀이 - 유료 모드 B]")
    expect(withInterp.interpretation).toContain("🔮 [올해")
    expect(withInterp.interpretation).toContain("📅 [12개월 월별 운세 흐름]")
  })
})
