import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  type EarthlyBranch,
  type FourPillarsDetail,
  type HeavenlyStem,
} from "manseryeok"
import { getHeavenlyStemYinYang } from "manseryeok"
import { getNextJie, getPreviousJie, toBirthDate } from "./solarTerms.js"

export const DAEUN_STEPS = 8
const STEP_YEARS = 10

function pillarTo60(stem: HeavenlyStem, branch: EarthlyBranch): number {
  for (let i = 0; i < 60; i++) {
    if (HEAVENLY_STEMS[i % 10] === stem && EARTHLY_BRANCHES[i % 12] === branch) return i
  }
  return 0
}

function indexToLabel(i: number): string {
  return `${HEAVENLY_STEMS[i % 10]}${EARTHLY_BRANCHES[i % 12]}`
}

/**
 * 대운의 순행 여부를 반환합니다.
 * 陽男·陰女 順, 陰男·陽女 逆
 */
export function daeunForward(
  isMale: boolean,
  yearHeavenlyStem: HeavenlyStem
): boolean {
  const yang = getHeavenlyStemYinYang(yearHeavenlyStem) === "양"
  if (isMale) return yang
  return !yang
}

/**
 * 대운을 계산합니다.
 */
export function computeDaeun(opts: {
  detail: FourPillarsDetail
  birth: { year: number; month: number; day: number; hour: number; minute: number }
  isMale: boolean
}): {
  forward: boolean
  firstStartAge: number
  /** 각 대운맏이 시작 (만)나이(소수 1자리) */
  steps: { order: number; ganzhi: string; fromAge: number; toAge: number }[]
} {
  const { detail, birth, isMale } = opts
  const yStem = detail.year.heavenlyStem
  const forward = daeunForward(isMale, yStem)
  const mStem = detail.month.heavenlyStem
  const mBr = detail.month.earthlyBranch
  let idx = pillarTo60(mStem, mBr)
  const d = toBirthDate(birth.year, birth.month, birth.day, birth.hour, birth.minute)
  const jie = forward ? getNextJie(d) : getPreviousJie(d)
  const diffMs = Math.abs(jie.getTime() - d.getTime())
  const days = diffMs / 86400000
  const firstStartAge = Math.round((days / 3) * 10) / 10
  const steps: { order: number; ganzhi: string; fromAge: number; toAge: number }[] = []
  for (let s = 0; s < DAEUN_STEPS; s++) {
    idx = forward ? (idx + 1) % 60 : (idx - 1 + 60) % 60
    const fromAge = firstStartAge + s * STEP_YEARS
    const toAge = fromAge + STEP_YEARS
    steps.push({
      order: s + 1,
      ganzhi: indexToLabel(idx),
      fromAge,
      toAge,
    })
  }
  return { forward, firstStartAge, steps }
}
