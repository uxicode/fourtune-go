import type { FourPillarsDetail, HeavenlyStem } from "manseryeok"
import { getEarthlyBranchElement, getHeavenlyStemElement } from "manseryeok"
import type { FiveElement } from "manseryeok"
import { sipsungForStems, SIPSUNG, type SipsungName } from "./sipsung.js"

const E_ORDER = ["목", "화", "토", "금", "수"] as const
function idx(x: FiveElement) {
  return E_ORDER.indexOf(x)
}

/**
 * 점수(휴리스틱): 印比 가산, 식상재관 감소, 월지 본기와 일간 생극.
 */
export function estimateDayMasterStrength(
  detail: FourPillarsDetail
): {
  level: "신강" | "중화" | "신약"
  score: number
  reasons: string[]
} {
  const day = detail.day.heavenlyStem
  const dEl = getHeavenlyStemElement(day)
  const mBr = detail.month.earthlyBranch
  const mEl = getEarthlyBranchElement(mBr)
  const reasons: string[] = []
  let score = 0

  const di = idx(dEl)
  const mi = idx(mEl)
  if (mi === di) {
    score += 2.5
    reasons.push("월지(지장 본기 기준) 오행이 일간과 비슷해 득령에 가깝다고 봤습니다.")
  } else if (mi === (di + 4) % 5) {
    score += 1.5
    reasons.push("월지 오행이 일간을 생(生)하는 쪽에 가깝다고 봤습니다.")
  } else if (mi === (di + 3) % 5) {
    score -= 1.5
    reasons.push("월지 오행이 일간을 극(剋)하는 쪽이면 불리할 수 있다고 봤습니다.")
  }

  const stems: HeavenlyStem[] = [
    detail.year.heavenlyStem,
    detail.month.heavenlyStem,
    detail.hour.heavenlyStem,
  ]
  for (const s of stems) {
    const n = sipsungForStems(day, s)
    score += supportWeight(n)
  }

  if (Math.abs(score) < 0.2) {
    reasons.push("천간 십성(일간·비겁·인성 vs 식상·재·관) 가중이 중립에 가깝습니다.")
  }

  let level: "신강" | "중화" | "신약" = "중화"
  if (score > 1.2) {
    level = "신강"
    reasons.push("가중 합이 양(+) 쪽 — 전통적 ‘신강’에 맞닿을 ‘수’로 휴리스틱을 두었습니다.")
  } else if (score < -1.2) {
    level = "신약"
    reasons.push("가중 합이 음(-) 쪽 — ‘신약’ 쪽 휴리스틱입니다.")
  } else
    reasons.push("가중이 중간 — ‘중화(中和)’ 쪽으로 단순 분류합니다.")

  return { level, score, reasons }
}

function supportWeight(n: SipsungName): number {
  if (n === SIPSUNG.jeongin || n === SIPSUNG.pyeonin) return 1.1
  if (n === SIPSUNG.bijeon || n === SIPSUNG.geopjae) return 0.8
  if (n === SIPSUNG.siksin || n === SIPSUNG.sanggwan) return -0.55
  if (n === SIPSUNG.jeongjae || n === SIPSUNG.pyeonjae) return -0.55
  if (n === SIPSUNG.jeonggwan || n === SIPSUNG.pyeongwan) return -0.5
  return 0
}
