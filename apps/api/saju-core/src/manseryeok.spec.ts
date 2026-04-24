import { describe, expect, it } from "vitest"
import { calculateFourPillars, fourPillarsToString, lunarToSolar, solarToLunar } from "manseryeok"
import { calculateSajuChart } from "./calculateChart.js"

/** README(및 PR)에 나온 양력 예: 1992-10-24 05:30 */
describe("manseryeok golden cases", () => {
  it("1992-10-24 5:30 양력", () => {
    const r = calculateFourPillars({
      year: 1992,
      month: 10,
      day: 24,
      hour: 5,
      minute: 30,
    })
    expect(fourPillarsToString(r)).toMatchInlineSnapshot(
      '"임신연주, 경술월주, 계유일주, 을묘시주"'
    )
  })

  it("saju-core 래퍼가 동일 summaryLine", () => {
    const c = calculateSajuChart({
      kind: "solar",
      year: 1992,
      month: 10,
      day: 24,
      hour: 5,
      minute: 30,
      timeUnknown: false,
      gender: "male",
      saeunFromYear: 2024,
    })
    expect(c.summaryLine).toBe("임신연주, 경술월주, 계유일주, 을묘시주")
  })

  it("solarToLunar 2024-1-1", () => {
    expect(solarToLunar(2024, 1, 1)).toEqual({
      year: 2023,
      month: 11,
      day: 19,
      isLeapMonth: false,
    })
  })

  it("lunarToSolar 2020 윤4월 1일", () => {
    expect(lunarToSolar(2020, 4, 1, true)).toEqual({
      year: 2020,
      month: 5,
      day: 23,
    })
  })
})

describe("time unknown → 정오", () => {
  it("1992-10-24 시 모름", () => {
    const c = calculateSajuChart({
      kind: "solar",
      year: 1992,
      month: 10,
      day: 24,
      hour: 0,
      minute: 0,
      timeUnknown: true,
      gender: "male",
      saeunFromYear: 2024,
    })
    expect(c.timeIsApproximate).toBe(true)
    const noon = calculateFourPillars({
      year: 1992,
      month: 10,
      day: 24,
      hour: 12,
      minute: 0,
    })
    expect(c.summaryLine).toBe(fourPillarsToString(noon))
  })
})
