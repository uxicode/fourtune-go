import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  type HeavenlyStem,
} from "manseryeok"
import { ganzhiForSolarYear } from "./solarTerms.js"
import { sipsungForStems, sipsungForBranchMain } from "./sipsung.js"
import type { EarthlyBranch } from "manseryeok"

function indexToLabel(iStem: number, iBr: number): { label: string; stem: HeavenlyStem; branch: EarthlyBranch } {
  return {
    label: `${HEAVENLY_STEMS[iStem]}${EARTHLY_BRANCHES[iBr]}`,
    stem: HEAVENLY_STEMS[iStem],
    branch: EARTHLY_BRANCHES[iBr],
  }
}

const DEFAULT_SAEUN_COUNT = 6

/**
 * **중순(여름) 기준**으로 연간의 년(년柱) 干支(입춘 전후 흐름은 연초/말 풀고 시 연도 설명).
 */
export function computeSaeun(
  dayHeavenlyStem: HeavenlyStem,
  fromCalendarYear: number,
  count = DEFAULT_SAEUN_COUNT
): {
  year: number
  ganzhi: string
  stemSipsung: string
  branchSipsung: string
}[] {
  const out: {
    year: number
    ganzhi: string
    stemSipsung: string
    branchSipsung: string
  }[] = []
  for (let i = 0; i < count; i++) {
    const cy = fromCalendarYear + i
    const { stem: si, branch: bi } = ganzhiForSolarYear(cy)
    const { label, stem, branch } = indexToLabel(si, bi)
    out.push({
      year: cy,
      ganzhi: label,
      stemSipsung: sipsungForStems(dayHeavenlyStem, stem),
      branchSipsung: sipsungForBranchMain(dayHeavenlyStem, branch),
    })
  }
  return out
}
