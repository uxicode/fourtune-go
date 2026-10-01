import { describe, expect, it } from "vitest"
import { calculateSajuChart } from "./calculateChart.js"

describe("easyInterpretation", () => {
  it("generates rich easy interpretation with one-line summary and geju", () => {
    // 1990년 5월 15일 14:30 양력 남성
    const chart = calculateSajuChart({
      kind: "solar",
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      timeUnknown: false,
      gender: "male",
    })

    expect(chart.easyInterpretation).toBeDefined()
    const easy = chart.easyInterpretation!

    expect(easy.oneLineSummary).toBeTruthy()
    expect(easy.keywords.length).toBeGreaterThan(0)
    expect(easy.dayMasterStory.stem).toBe(chart.dayHeavenlyStem)
    expect(easy.dayMasterStory.symbol).toBeTruthy()
    expect(easy.dayMasterStory.personality).toBeTruthy()
    expect(easy.gejuAnalysis.detectedGeju).toBeTruthy()
    expect(easy.gejuAnalysis.badge).toBeTruthy()
    expect(easy.careerAndTalent.recommendedFields).toBeTruthy()
    expect(easy.wealthStyle.pattern).toBeTruthy()
    expect(easy.elementBalance.counts.목).toBeGreaterThanOrEqual(0)
    expect(easy.elementBalance.prescriptions.length).toBeGreaterThan(0)
    expect(easy.luckAdvice.currentYearInsight).toBeTruthy()
    expect(easy.healthCare.vulnerableAreas.length).toBeGreaterThan(0)
    expect(easy.healthCare.lifestyleAdvice).toBeTruthy()
    expect(easy.lifeGuidance.doNotDo.length).toBeGreaterThan(0)
    expect(easy.lifeGuidance.cautions.length).toBeGreaterThan(0)
    expect(easy.lifeGuidance.keepClose.length).toBeGreaterThan(0)
    expect(easy.lifeGuidance.luckyElements.colors).toBeTruthy()
    expect(easy.fortuneTiming.peakLuck.signs.length).toBeGreaterThan(0)
    expect(easy.fortuneTiming.lowLuck.signs.length).toBeGreaterThan(0)
  })


  it("handles user case (갑신일주 샘플)", () => {
    // 1998년 3월 23일 09:30 양력 (무오 을묘 갑신 기사)
    const chart = calculateSajuChart({
      kind: "solar",
      year: 1978,
      month: 3,
      day: 15,
      hour: 9,
      minute: 40,
      timeUnknown: false,
      gender: "male",
    })

    expect(chart.easyInterpretation).toBeDefined()
    expect(chart.easyInterpretation?.dayMasterStory.stem).toBeTruthy()
    expect(chart.easyInterpretation?.gejuAnalysis.detectedGeju).toBeTruthy()
  })
})
