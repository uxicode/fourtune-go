import { describe, expect, it } from "vitest"
import { sipsungForStems } from "./sipsung.js"
import { daeunForward } from "./daeun.js"

describe("sipsung", () => {
  it("갑 일간 — 갑은 비견, 을은 겁재", () => {
    expect(sipsungForStems("갑", "갑")).toBe("비견")
    expect(sipsungForStems("갑", "을")).toBe("겁재")
  })

  it("갑 일간 — 병 식신, 정 상관", () => {
    expect(sipsungForStems("갑", "병")).toBe("식신")
    expect(sipsungForStems("갑", "정")).toBe("상관")
  })
})

describe("daeun direction", () => {
  it("壬年(양) 남 순, 여 역", () => {
    expect(daeunForward(true, "임")).toBe(true)
    expect(daeunForward(false, "임")).toBe(false)
  })
  it("乙年(음) 남 역, 여 순", () => {
    expect(daeunForward(true, "을")).toBe(false)
    expect(daeunForward(false, "을")).toBe(true)
  })
})
