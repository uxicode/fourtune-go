import { describe, expect, it } from "vitest"
import { GANZHI_60, GANZHI_60_ORDER } from "./content/ganzhi60.js"
import { SIPSIN_10 } from "./content/sipsin10.js"
import type { SipsungNameDto } from "./types.js"

describe("ganzhi60", () => {
  it("has 60 unique keys", () => {
    const keys = Object.keys(GANZHI_60)
    expect(keys).toHaveLength(60)
    expect(new Set(keys).size).toBe(60)
  })

  it("order index matches 甲子…癸亥 cycle", () => {
    expect(GANZHI_60_ORDER[0]).toBe("갑자")
    expect(GANZHI_60_ORDER[59]).toBe("계해")
    expect(GANZHI_60["계유"].title).toBe("癸酉")
  })

  it("sample pillars exist", () => {
    expect(GANZHI_60["갑자"]).toBeDefined()
    expect(GANZHI_60["계유"]).toBeDefined()
    expect(GANZHI_60["갑자"].body.length).toBeGreaterThan(10)
  })
})

describe("sipsin10", () => {
  it("covers all SipsungNameDto keys", () => {
    const expected: SipsungNameDto[] = [
      "비견",
      "겁재",
      "식신",
      "상관",
      "편재",
      "정재",
      "편관",
      "정관",
      "편인",
      "정인",
    ]
    for (const k of expected) {
      expect(SIPSIN_10[k]).toBeDefined()
      expect(SIPSIN_10[k].keywords.length).toBeGreaterThan(0)
      expect(SIPSIN_10[k].socialMeaning.length).toBeGreaterThan(0)
    }
  })
})
