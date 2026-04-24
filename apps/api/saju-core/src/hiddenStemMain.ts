import type { EarthlyBranch, HeavenlyStem } from "manseryeok"

/** 지지 본기(本氣) 천만(천간 1자) — 휴리스틱, 지장간 전체와 달릴 수 있음. */
const BRANCH_TO_MAIN: Record<EarthlyBranch, HeavenlyStem> = {
  자: "계",
  축: "기",
  인: "갑",
  묘: "을",
  진: "무",
  사: "병",
  오: "정",
  미: "기",
  신: "경",
  유: "신",
  술: "무",
  해: "임",
}

export function getBranchMainHeavenlyStem(branch: EarthlyBranch): HeavenlyStem {
  return BRANCH_TO_MAIN[branch]
}
