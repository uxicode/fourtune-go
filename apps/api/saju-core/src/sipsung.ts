import {
  type HeavenlyStem,
  type Pillar,
  getHeavenlyStemElement,
  getHeavenlyStemYinYang,
} from "manseryeok"
import type { EarthlyBranch, FiveElement } from "manseryeok"
import { getBranchMainHeavenlyStem } from "./hiddenStemMain.js"

const ELEM_ORDER: FiveElement[] = ["목", "화", "토", "금", "수"]

function elementIndex(e: FiveElement): number {
  return ELEM_ORDER.indexOf(e)
}

/** 十神 한글(전통) */
export const SIPSUNG = {
  bijeon: "비견", // 比肩
  geopjae: "겁재", // 劫財
  siksin: "식신", // 食神
  sanggwan: "상관", // 傷官
  pyeonjae: "편재", // 偏財
  jeongjae: "정재", // 正財
  pyeongwan: "편관", // 偏官(七殺)
  jeonggwan: "정관", // 正官
  pyeonin: "편인", // 偏印
  jeongin: "정인", // 正印
} as const

export type SipsungName = (typeof SIPSUNG)[keyof typeof SIPSUNG]

/**
 * 일간(日干) 기준, 다른 천간에 대한 십성.
 * Same element: same yin-yang=비견, else=겁재
 */
export function sipsungForStems(
  dayStem: HeavenlyStem,
  otherStem: HeavenlyStem
): SipsungName {
  const dEl = getHeavenlyStemElement(dayStem)
  const oEl = getHeavenlyStemElement(otherStem)
  const dYy = getHeavenlyStemYinYang(dayStem)
  const oYy = getHeavenlyStemYinYang(otherStem)
  const di = elementIndex(dEl)
  const oi = elementIndex(oEl)
  if (di === oi) return dYy === oYy ? SIPSUNG.bijeon : SIPSUNG.geopjae
  if (oi === (di + 1) % 5) return dYy === oYy ? SIPSUNG.siksin : SIPSUNG.sanggwan
  if (oi === (di + 2) % 5) return dYy === oYy ? SIPSUNG.pyeonjae : SIPSUNG.jeongjae
  if (oi === (di + 3) % 5) return dYy === oYy ? SIPSUNG.pyeongwan : SIPSUNG.jeonggwan
  if (oi === (di + 4) % 5) return dYy === oYy ? SIPSUNG.pyeonin : SIPSUNG.jeongin
  return SIPSUNG.bijeon
}

export function sipsungForBranchMain(dayStem: HeavenlyStem, branch: EarthlyBranch): SipsungName {
  return sipsungForStems(dayStem, getBranchMainHeavenlyStem(branch))
}

export type PillarSipsung = {
  stem: SipsungName
  branchFromMain: SipsungName
}

export function sipsungForPillar(dayStem: HeavenlyStem, pillar: Pillar): PillarSipsung {
  return {
    stem: sipsungForStems(dayStem, pillar.heavenlyStem),
    branchFromMain: sipsungForBranchMain(dayStem, pillar.earthlyBranch),
  }
}

