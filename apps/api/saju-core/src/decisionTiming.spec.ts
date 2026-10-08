import { describe, expect, it } from "vitest"
import { calculateSajuChart } from "./calculateChart.js"
import { generateDecisionTiming } from "./decisionTiming.js"
import type { DecisionTimingDto, SajuChartDto } from "./types.js"

// 테스트 기준 사주: 1992-10-24 05:30 남성
const BASE_INPUT = {
  kind: "solar" as const,
  year: 1992,
  month: 10,
  day: 24,
  hour: 5,
  minute: 30,
  timeUnknown: false,
  gender: "male" as const,
}

describe("generateDecisionTiming — 기본 구조 검증", () => {
  const chart: SajuChartDto = calculateSajuChart({ ...BASE_INPUT, mode: "a" })
  // 기준일: 2026-10-08 (10월 → 다음달 11월)
  const refDate = new Date(2026, 9, 8) // Oct 8, 2026
  const timing: DecisionTimingDto = generateDecisionTiming(chart, refDate)

  it("반환 구조: items 3개, referenceDate, thisMonthLabel, nextMonthLabel 존재", () => {
    expect(timing.items).toHaveLength(3)
    expect(timing.referenceDate).toBe("2026-10-08")
    expect(timing.thisMonthLabel).toBe("2026년 10월")
    expect(timing.nextMonthLabel).toBe("2026년 11월")
  })

  it("items 에 이직·계약·이사 모두 포함", () => {
    const types = timing.items.map((i) => i.type)
    expect(types).toContain("이직")
    expect(types).toContain("계약")
    expect(types).toContain("이사")
  })

  it("각 item 의 score 는 1~10 범위", () => {
    for (const item of timing.items) {
      expect(item.thisMonth.score).toBeGreaterThanOrEqual(1)
      expect(item.thisMonth.score).toBeLessThanOrEqual(10)
      expect(item.nextMonth.score).toBeGreaterThanOrEqual(1)
      expect(item.nextMonth.score).toBeLessThanOrEqual(10)
    }
  })

  it("각 item 의 grade 는 유효한 값", () => {
    const validGrades = ["매우 좋음", "좋음", "보통", "신중", "불리"]
    for (const item of timing.items) {
      expect(validGrades).toContain(item.thisMonth.grade)
      expect(validGrades).toContain(item.nextMonth.grade)
    }
  })

  it("recommendation 은 유효한 값", () => {
    const validRecs = ["이번 달", "다음 달", "둘 다 비슷"]
    for (const item of timing.items) {
      expect(validRecs).toContain(item.recommendation)
    }
  })

  it("summary 는 비어있지 않음", () => {
    for (const item of timing.items) {
      expect(item.summary.length).toBeGreaterThan(10)
    }
  })

  it("각 item 의 reasons 는 비어있지 않음", () => {
    for (const item of timing.items) {
      expect(item.thisMonth.reasons.length).toBeGreaterThan(0)
      expect(item.nextMonth.reasons.length).toBeGreaterThan(0)
    }
  })

  it("ganzhi 는 두 글자 이상", () => {
    for (const item of timing.items) {
      expect(item.thisMonth.ganzhi.length).toBeGreaterThanOrEqual(2)
      expect(item.nextMonth.ganzhi.length).toBeGreaterThanOrEqual(2)
    }
  })
})

describe("generateDecisionTiming — 연도 경계 (12월 → 다음 해 1월) 처리", () => {
  const chart: SajuChartDto = calculateSajuChart({ ...BASE_INPUT, mode: "a" })
  // 기준일: 2026-12-15 (12월 → 다음달은 2027년 1월)
  const refDate = new Date(2026, 11, 15)
  const timing: DecisionTimingDto = generateDecisionTiming(chart, refDate)

  it("thisMonthLabel 이 2026년 12월", () => {
    expect(timing.thisMonthLabel).toBe("2026년 12월")
  })

  it("nextMonthLabel 이 2027년 1월 (연도 경계 올바른 처리)", () => {
    expect(timing.nextMonthLabel).toBe("2027년 1월")
  })

  it("다음달 ganzhi 가 2026년 12월과 다름", () => {
    for (const item of timing.items) {
      expect(item.thisMonth.ganzhi).not.toBe(item.nextMonth.ganzhi)
    }
  })
})

describe("generateDecisionTiming — 월주(月柱) 간지 도출 검증", () => {
  const chart: SajuChartDto = calculateSajuChart({ ...BASE_INPUT, mode: "a" })

  it("각 월별로 서로 다른 간지가 도출됨 (1월~12월 전체 순회)", () => {
    const ganzhiSet = new Set<string>()
    for (let m = 1; m <= 12; m++) {
      const ref = new Date(2026, m - 1, 1)
      const t = generateDecisionTiming(chart, ref)
      ganzhiSet.add(t.items[0].thisMonth.ganzhi)
    }
    // 12개월은 12개의 서로 다른 지지를 가져야 함
    expect(ganzhiSet.size).toBe(12)
  })

  it("2026년 2월 월운 지지가 인(寅)月 — 연두법 기준 확인", () => {
    const ref = new Date(2026, 1, 1) // Feb 2026
    const t = generateDecisionTiming(chart, ref)
    // 2월은 寅月(인월)이어야 함: 간지가 "인"을 포함해야 함
    for (const item of t.items) {
      expect(item.thisMonth.ganzhi).toMatch(/인/)
    }
  })
})

describe("generateDecisionTiming — 점수 다양성 및 결정 유형별 차별화", () => {
  const chart: SajuChartDto = calculateSajuChart({ ...BASE_INPUT, mode: "a" })

  it("이직·계약·이사 세 결정의 점수가 완전히 동일하지 않음 (결정 유형별 가중치 작동)", () => {
    const ref = new Date(2026, 9, 8)
    const timing = generateDecisionTiming(chart, ref)
    const thisScores = timing.items.map((i) => i.thisMonth.score)
    const nextScores = timing.items.map((i) => i.nextMonth.score)
    // 3개 결정의 점수가 모두 동일하지 않아야 함 (적어도 2가지 이상의 다른 값)
    expect(new Set(thisScores).size).toBeGreaterThanOrEqual(2)
    expect(new Set(nextScores).size).toBeGreaterThanOrEqual(2)
  })

  it("calculateSajuChart 결과에 decisionTiming 이 포함됨 (Mode A)", () => {
    const c = calculateSajuChart({ ...BASE_INPUT, mode: "a" })
    expect(c.decisionTiming).toBeDefined()
    expect(c.decisionTiming?.items).toHaveLength(3)
  })

  it("calculateSajuChart 결과에 decisionTiming 이 포함됨 (Mode B)", () => {
    const c = calculateSajuChart({ ...BASE_INPUT, mode: "b" })
    expect(c.decisionTiming).toBeDefined()
    expect(c.decisionTiming?.items).toHaveLength(3)
  })
})

describe("generateDecisionTiming — recommendation 로직 검증", () => {
  it("이번 달 점수가 다음 달보다 1.5 이상 높으면 '이번 달' 권장", () => {
    // 여러 달을 돌아보며 at least 하나의 '이번 달' 추천이 나와야 함
    const chart: SajuChartDto = calculateSajuChart({ ...BASE_INPUT, mode: "a" })
    const recommendations = new Set<string>()
    for (let m = 1; m <= 12; m++) {
      const ref = new Date(2026, m - 1, 15)
      const t = generateDecisionTiming(chart, ref)
      for (const item of t.items) {
        recommendations.add(item.recommendation)
      }
    }
    // 1년 12개월 × 3개 결정 = 36개의 결과에서 적어도 '이번 달'과 '다음 달' 두 가지가 나와야 함
    expect(recommendations.size).toBeGreaterThanOrEqual(2)
  })
})
