/**
 * 결정 타이밍(決定 timing) 모듈
 *
 * 이직(Job Change) · 계약(Contract) · 이사(Moving House) 세 종류의 결정에 대해
 * 이번 달 vs 다음 달의 월운(月運)을 사주학 원칙에 따라 비교하여
 * 어느 달이 더 유리한지, 그 이유를 한국어로 설명합니다.
 *
 * ── 사주학 원칙 요약 ──────────────────────────────────────────────────────
 *
 * 1. 월운(月運) 도출: 연두법(遁月法)으로 당월 천간을 구하고, 지지는 인(寅)월 기준
 *    브랜치 인덱스를 양력 달에 맞게 할당합니다.
 *    (2월 = 寅, 3월 = 卯 … 12월 = 子, 1월 = 丑 순서)
 *
 * 2. 기본 점수: 일간(日干) 기준 월운 천간의 십신, 신강·신약 희기신 판정,
 *    일지·월지와 월운 지지의 충(沖)·합(合) 여부로 산출.
 *    (generateMonthlyFortunes 와 동일한 가중치 사용)
 *
 * 3. 결정 유형별 추가 가중치:
 *    - 이직: 직업운(官星·食傷) 특화. 관성은 안정 vs 전환 이중성, 식상은 새로운 도전 적합.
 *      月地支 충(沖) → 직장 환경 변동 → 이직 계기로 해석해 소폭 보정.
 *    - 계약: 문서·인장운(印星·正財). 인수(印綬) 강한 달 = 계약 길조.
 *      충(沖) → 계약 파기 위험 → 강한 페널티.
 *      합(合) → 상생 관계 → 계약 성사 보너스.
 *    - 이사: 역마(驛馬) 기운(寅申巳亥 지지) + 偏財(환경 변동).
 *      일지 충 → 거주지 변동 신호(자발적 이사엔 중립·소폭 긍정).
 *      합 → 정착 에너지 → 이사 완료·안정에 유리.
 *
 * 4. 최종 점수: 1~10 정수로 정규화. 5-6 = 보통, 7+ = 좋음, 9+ = 매우 좋음,
 *    4 = 신중, 3 이하 = 불리.
 */

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  type HeavenlyStem,
  type EarthlyBranch,
} from "manseryeok"
import { ganzhiForSolarYear } from "./solarTerms.js"
import { sipsungForStems, sipsungForBranchMain } from "./sipsung.js"
import type { SajuChartDto, SipsungNameDto } from "./types.js"

// ── 공개 타입 ────────────────────────────────────────────────────────────────

export type DecisionType = "이직" | "계약" | "이사"

export type DecisionGrade = "매우 좋음" | "좋음" | "보통" | "신중" | "불리"

export interface DecisionMonthResult {
  ganzhi: string        // 월운 간지 (예: 甲寅)
  monthLabel: string    // 사람이 읽는 월 이름 (예: "2026년 10월")
  score: number         // 1~10
  grade: DecisionGrade
  reasons: string[]     // 사주학적 근거 (한국어 불릿)
}

export interface DecisionItem {
  type: DecisionType
  icon: string          // 이모지 아이콘
  thisMonth: DecisionMonthResult
  nextMonth: DecisionMonthResult
  /** 어느 달을 권장하는지 */
  recommendation: "이번 달" | "다음 달" | "둘 다 비슷"
  /** 한 줄 한국어 요약 */
  summary: string
}

export interface DecisionTimingDto {
  items: DecisionItem[]
  referenceDate: string   // "YYYY-MM-DD"
  thisMonthLabel: string
  nextMonthLabel: string
}

// ── 내부 상수 ────────────────────────────────────────────────────────────────

/** 6충(六沖): 서로 충돌하는 지지 쌍 (한글 표기 기준) */
const CHUNG_MAP: Record<string, string> = {
  자: "오", 오: "자",
  축: "미", 미: "축",
  인: "신", 신: "인",
  묘: "유", 유: "묘",
  진: "술", 술: "진",
  사: "해", 해: "사",
}

/** 6합(六合): 서로 합하는 지지 쌍 (한글 표기 기준) */
const HAP_MAP: Record<string, string> = {
  자: "축", 축: "자",
  인: "해", 해: "인",
  묘: "술", 술: "묘",
  진: "유", 유: "진",
  사: "신", 신: "사",
  오: "미", 미: "오",
}

/**
 * 역마살 지지: 인·신·사·해 — 이동·변화의 기운이 강한 지지 (한글 표기).
 * 이사(이동) 결정 시 월지가 이 네 지지 중 하나이면 역마 에너지 가중.
 */
const YEOKMA_BRANCHES = new Set(["인", "신", "사", "해"])

/** 양력 월(1~12) → 지지 브랜치 인덱스 매핑 (만세력 기준 연두법 적용과 동일) */
function getBranchIdxForMonth(month: number): number {
  // 1월 = 丑(1), 2월 = 寅(2) … 11월 = 亥(11), 12월 = 子(0)
  return month === 12 ? 0 : month
}

/**
 * 연두법(遁月法): 년간 인덱스 + 월 오더 → 월간 인덱스
 * monthOrder: 인(寅)월=0, 묘(卯)월=1 … 축(丑)월=11
 */
function getMonthStemIndex(yearStemIndex: number, monthOrder: number): number {
  const firstStemIndex = ((yearStemIndex % 5) * 2 + 2) % 10
  return (firstStemIndex + monthOrder) % 10
}

/** 양력 월(1~12) → 연두법 월 오더 (寅=0 기준) */
function getMonthOrder(month: number): number {
  // 2월 = 寅월 = order 0, 3월 = order 1, … 1월 = order 11
  return (month + 10) % 12
}

/** 지지 충 여부 */
function isChung(b1: string, b2: string): boolean {
  return CHUNG_MAP[b1] === b2
}

/** 지지 합 여부 */
function isHap(b1: string, b2: string): boolean {
  return HAP_MAP[b1] === b2
}

// ── 십성 범주 분류 ────────────────────────────────────────────────────────────

type SipsungCategory = "식상" | "재성" | "관성" | "인성" | "비겁"

function sipsungCategory(s: SipsungNameDto): SipsungCategory {
  if (s === "식신" || s === "상관") return "식상"
  if (s === "정재" || s === "편재") return "재성"
  if (s === "정관" || s === "편관") return "관성"
  if (s === "정인" || s === "편인") return "인성"
  return "비겁"
}

// ── 월운 간지 도출 ────────────────────────────────────────────────────────────

interface MonthPillar {
  stem: HeavenlyStem
  branch: EarthlyBranch
  ganzhi: string
  stemSipsung: SipsungNameDto
  branchSipsung: SipsungNameDto
}

/**
 * 주어진 양력 연도·월의 월주(月柱)를 연두법으로 도출합니다.
 * year 경계(12월 → 다음 해 1월)도 자동 처리됩니다.
 */
function getMonthPillar(year: number, month: number, dayStem: HeavenlyStem): MonthPillar {
  const { stem: yearStemIdx } = ganzhiForSolarYear(year)
  const monthOrder = getMonthOrder(month)
  const mStemIdx = getMonthStemIndex(yearStemIdx, monthOrder)
  const branchIdx = getBranchIdxForMonth(month)

  const stem = HEAVENLY_STEMS[mStemIdx] as HeavenlyStem
  const branch = EARTHLY_BRANCHES[branchIdx] as EarthlyBranch
  const ganzhi = `${stem}${branch}`

  return {
    stem,
    branch,
    ganzhi,
    stemSipsung: sipsungForStems(dayStem, stem) as SipsungNameDto,
    branchSipsung: sipsungForBranchMain(dayStem, branch) as SipsungNameDto,
  }
}

// ── 기본 점수 계산 ────────────────────────────────────────────────────────────

/**
 * 신강/신약 + 십성 희기신 + 충·합 기반 기본 운세 점수 계산.
 * generateMonthlyFortunes 와 동일한 가중치를 사용해 일관성을 유지합니다.
 * 반환값은 연속 실수이며 이후 정수 점수로 정규화됩니다.
 */
function computeBaseScore(
  pillar: MonthPillar,
  strengthLevel: "신강" | "중화" | "신약",
  dayBranch: string,
  monthBranch: string
): { raw: number; hasDayChung: boolean; hasMonthChung: boolean; hasDayHap: boolean } {
  let score = 5.0 // 1~10 스케일의 중립점

  const { stemSipsung: stemSip, branchSipsung: branchSip, branch: mBranch } = pillar

  // 1. 신강·신약 희기신 보정 (yearlyFortune.ts 와 동일 계수 × 2 = 10점 스케일)
  if (strengthLevel === "신강") {
    if (["식신", "정재"].includes(stemSip)) score += 2.8
    else if (["편재", "상관", "정관"].includes(stemSip)) score += 1.8
    else if (stemSip === "편관") score += 0.8
    else if (stemSip === "비견") score -= 1.6
    else if (stemSip === "겁재") score -= 2.8
    else if (["편인", "정인"].includes(stemSip)) score -= 1.8
  } else if (strengthLevel === "신약") {
    if (["정인", "편인"].includes(stemSip)) score += 2.8
    else if (stemSip === "비견") score += 2.0
    else if (stemSip === "겁재") score += 1.0
    else if (["식신", "정재"].includes(stemSip)) score -= 0.6
    else if (stemSip === "정관") score -= 1.2
    else if (["편재", "상관"].includes(stemSip)) score -= 2.2
    else if (stemSip === "편관") score -= 3.2
  } else {
    // 중화
    if (["식신", "정재", "정관", "정인"].includes(stemSip)) score += 1.8
    else if (stemSip === "편재") score += 0.8
    else if (stemSip === "비견") score += 0.2
    else if (["상관", "편인"].includes(stemSip)) score -= 1.4
    else if (["겁재", "편관"].includes(stemSip)) score -= 2.4
  }

  // 2. 지지 십성 보정
  if (strengthLevel === "신강" && ["식신", "정재", "정관"].includes(branchSip)) score += 0.8
  if (strengthLevel === "신약" && ["정인", "비견"].includes(branchSip)) score += 0.8
  if (strengthLevel === "신약" && branchSip === "편관") score -= 1.0

  // 3. 충·합 판정 (일지·월지 기준)
  const hasDayChung = isChung(dayBranch, mBranch)
  const hasMonthChung = isChung(monthBranch, mBranch)
  const hasDayHap = isHap(dayBranch, mBranch)

  if (hasDayChung) score -= 2.2
  if (hasMonthChung) score -= 1.2
  if (hasDayHap) score += 1.6

  return { raw: score, hasDayChung, hasMonthChung, hasDayHap }
}

// ── 결정 유형별 점수 + 근거 ────────────────────────────────────────────────────

interface ScoredDecision {
  score: number       // 연속 실수 (clamp 전)
  reasons: string[]   // 한국어 근거 목록
}

/**
 * 이직(轉職) 타이밍 점수
 *
 * 원칙:
 * - 官星(정관·편관): 직업 변동의 핵심. 편관은 외부 압박 → 이직 계기.
 *   정관은 안정된 제도권 이직(공채·헤드헌팅). 신강 시 더 유리.
 * - 食傷(식신·상관): 새로운 역할·분야 도전에 탁월. 상관은 기존 틀 탈피.
 * - 재성: 연봉·처우 개선 목적 이직에 유리.
 * - 인성: 학습·자격 기반 이직(자격증·전직 교육). 문서운.
 * - 월주 충(沖): 직장 환경 변동 신호 → 이직 고려 계기 (중립~소폭 긍정).
 * - 일지 충: 개인 안정 흔들림 → 이직 결행 시 주의.
 */
function scoreJobChange(
  pillar: MonthPillar,
  base: { raw: number; hasDayChung: boolean; hasMonthChung: boolean; hasDayHap: boolean },
  strengthLevel: string
): ScoredDecision {
  let score = base.raw
  const reasons: string[] = []
  const { stemSipsung: stemSip, branchSipsung: branchSip, branch: mBranch } = pillar
  const stemCat = sipsungCategory(stemSip)
  const branchCat = sipsungCategory(branchSip)

  // 관성 보정: 이직·직업 변동의 핵심 십성
  if (stemSip === "편관") {
    if (strengthLevel === "신강") {
      score += 1.5
      reasons.push(`편관(七殺) 월: 외부 압박이 이직의 강한 계기가 되며, ${strengthLevel}의 일간이 이를 주도적으로 활용하기 좋은 시기입니다.`)
    } else {
      score -= 0.5
      reasons.push(`편관(七殺) 월: 직장 환경의 압박이 크나, ${strengthLevel}이면 무리한 이직보다 내실을 다지는 시기가 더 유리합니다.`)
    }
  } else if (stemSip === "정관") {
    score += 1.0
    reasons.push(`정관 월: 공정한 절차를 통한 이직(공채·헤드헌팅·승진성 이직)에 매우 길합니다. 명예와 직책 상승을 기대할 수 있습니다.`)
  }

  // 식상 보정: 새로운 분야·역할 도전에 적합
  if (stemCat === "식상") {
    score += 1.2
    const detail = stemSip === "상관"
      ? "상관 월: 기존 틀을 깨고 새로운 분야로 뛰어드는 데 최적입니다. 혁신적인 커리어 전환에 유리합니다."
      : "식신 월: 전문 기술과 역량을 앞세운 이직에 매우 유리합니다. 업계 내 평판이 높아지는 시기입니다."
    reasons.push(detail)
  }

  // 재성 보정: 처우·연봉 개선 이직
  if (stemCat === "재성") {
    score += 0.8
    reasons.push(`${stemSip} 월: 처우 및 연봉 개선을 목적으로 한 이직에 실리적으로 유리합니다. 협상력이 높아집니다.`)
  }

  // 인성 보정: 자격·교육 기반 이직
  if (stemCat === "인성") {
    score += 0.5
    reasons.push(`${stemSip} 월: 전문 자격 취득, 교육 수료 후 이직에 문서운이 따라 이력서·계약서 처리가 순조롭습니다.`)
  }

  // 지지 보정
  if (branchCat === "관성") {
    score += 0.6
    reasons.push(`월운 지지 ${branchSip}: 직업 관련 기회의 지반이 강화됩니다.`)
  }
  if (branchCat === "식상") {
    score += 0.5
    reasons.push(`월운 지지 ${branchSip}: 자신의 재능과 역량 발휘에 유리한 환경이 형성됩니다.`)
  }

  // 충·합 보정
  if (base.hasDayChung) {
    // 일지 충: 개인 안정성 흔들림 - 이직 결행 주의
    score -= 0.8
    reasons.push(`일지(日支) 충(沖): 개인 안정성이 흔들릴 수 있어 이직 결행 시 신중한 검토가 필요합니다.`)
  }
  if (base.hasMonthChung && !base.hasDayChung) {
    // 월지 충: 직장 환경 변동 신호 → 이직 계기로 활용 가능 (중립~소폭 긍정)
    score += 0.3
    reasons.push(`월지(月支) 충(沖): 현재 직장 환경에 변동의 기운이 작용하여 이직을 고려하는 좋은 계기가 될 수 있습니다.`)
  }
  if (base.hasDayHap) {
    score += 0.5
    reasons.push(`일지 육합(六合): 새로운 직장과의 인연이 자연스럽게 이어지는 흐름입니다.`)
  }

  // 역마 기운 (이직은 이동 에너지 필요)
  if (YEOKMA_BRANCHES.has(mBranch)) {
    score += 0.5
    reasons.push(`역마(驛馬) 기운의 지지(${mBranch}): 이동·변화의 에너지가 활성화되어 직장 이동에 유리합니다.`)
  }

  // 기본 근거: 십성 조합 요약 (항상 추가 — 최소 1개 근거 보장)
  if (reasons.length === 0) {
    const baseDesc = base.raw >= 5
      ? `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하는 달로, 기본 운세 흐름이 이직 고려에 무난합니다.`
      : `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하는 달로, 섣부른 이직보다 신중한 준비가 필요한 시기입니다.`
    reasons.push(baseDesc)
  }

  return { score, reasons }
}

/**
 * 계약(契約) 타이밍 점수
 *
 * 원칙:
 * - 印星(인성): 인수(印綬) = 문서·인장·계약서운. 인성이 강한 달이 계약 길조.
 *   정인은 공식 계약, 편인은 기술·IP 계약에 특화.
 * - 正財: 안정적 자산 형성 = 계약을 통한 고정 수입·자산 확보에 최적.
 * - 正官: 법적 절차와 원칙 준수 = 공신력 있는 계약에 유리.
 * - 충(沖): 계약 파기·조건 변경 위험이 높아짐 → 강한 페널티.
 * - 합(合): 협력 관계 형성 → 계약 성사 보너스.
 * - 식상·비겁: 계약 관련 문서운 약화 → 소폭 페널티.
 */
function scoreContract(
  pillar: MonthPillar,
  base: { raw: number; hasDayChung: boolean; hasMonthChung: boolean; hasDayHap: boolean }
): ScoredDecision {
  let score = base.raw
  const reasons: string[] = []
  const { stemSipsung: stemSip, branchSipsung: branchSip } = pillar
  const stemCat = sipsungCategory(stemSip)
  const branchCat = sipsungCategory(branchSip)

  // 인성 보정: 계약·문서 핵심
  if (stemCat === "인성") {
    score += 2.0
    const detail = stemSip === "정인"
      ? "정인 월: 공식 문서·계약서 처리에 최고의 기운입니다. 인감도장과 서명이 길하게 작용하는 최적의 시기입니다."
      : "편인 월: 지적 재산권·기술 라이선스·특수 계약 체결에 탁월한 기운이 작용합니다."
    reasons.push(detail)
  }

  // 정재 보정: 안정된 자산·고정 수입 계약
  if (stemSip === "정재") {
    score += 1.8
    reasons.push(`정재 월: 고정 수입이나 안정된 자산을 보장하는 계약(임대차·용역·근로) 체결에 매우 길합니다.`)
  } else if (stemSip === "편재") {
    score += 0.8
    reasons.push(`편재 월: 사업·투자 계약에서 유리한 조건을 이끌어낼 수 있습니다. 단, 조항을 꼼꼼히 검토하세요.`)
  }

  // 정관 보정: 공식·법적 계약
  if (stemSip === "정관") {
    score += 1.2
    reasons.push(`정관 월: 법적 절차와 원칙이 중시되는 달로, 공신력 있는 계약 체결에 아주 유리합니다.`)
  }

  // 지지 보정
  if (branchCat === "인성") {
    score += 1.0
    reasons.push(`월운 지지 ${branchSip}: 문서와 인장 관련 기운이 지반에서도 뒷받침됩니다.`)
  }
  if (branchCat === "재성") {
    score += 0.6
    reasons.push(`월운 지지 ${branchSip}: 계약을 통한 재물운이 안정적으로 형성됩니다.`)
  }

  // 충·합 — 계약에서 충은 특히 치명적
  if (base.hasDayChung) {
    score -= 3.0
    reasons.push(`⚠️ 일지(日支) 충(沖): 계약 파기·분쟁·중도 해제의 위험이 매우 높습니다. 이번 달 계약 체결은 강하게 권장하지 않습니다.`)
  } else if (base.hasMonthChung) {
    score -= 1.5
    reasons.push(`⚠️ 월지(月支) 충(沖): 계약 조건 변경이나 이견 발생 가능성이 있습니다. 조항을 세 번 이상 검토하세요.`)
  }
  if (base.hasDayHap) {
    score += 2.0
    reasons.push(`일지 육합(六合): 계약 상대방과 상생 에너지가 형성되어 유리한 조건으로 계약 성사 가능성이 높습니다.`)
  }

  // 식상·비겁 약소 페널티: 문서보다 표현·경쟁 에너지 강해 계약에 불안정
  if (stemCat === "식상") {
    score -= 0.5
    reasons.push(`${stemSip} 월: 표현·창의 에너지가 강한 달로, 계약보다 기획·발표 단계에 더 적합합니다. 계약 전 꼼꼼한 검토가 필요합니다.`)
  }
  if (stemCat === "비겁") {
    score -= 0.8
    reasons.push(`${stemSip} 월: 자기 주장과 독립 에너지가 강해 계약 합의점 도출에 시간이 걸릴 수 있습니다.`)
  }

  // 기본 근거: 항상 최소 1개 보장
  if (reasons.length === 0) {
    const baseDesc = base.raw >= 5
      ? `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하며, 기본 운세 흐름이 계약 체결에 무난한 시기입니다.`
      : `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하며, 계약 전 조항을 면밀히 검토하고 신중하게 진행하세요.`
    reasons.push(baseDesc)
  }

  return { score, reasons }
}

/**
 * 이사(移徙) 타이밍 점수
 *
 * 원칙:
 * - 역마살(驛馬殺) 지지(寅·申·巳·亥): 이동·변화의 기운. 이사 결행에 에너지 동반.
 * - 偏財: 환경 변동·새로운 공간 개척에 유리.
 * - 비겁: 독립심·자립 에너지 → 주거 독립·분가 이사에 적합.
 * - 正財·正官: 안정 추구 → 이사보다 현 거처 정착에 유리. 하지만 이사 자체의 정착
 *   완료(입주·전세 계약)에는 유리.
 * - 일지 충(沖): 거주지 변동 신호 → 자발적 이사에는 중립(에너지 활성화 관점).
 *   단, 이사 후 불안정 가능성에 주의.
 * - 월지 충: 사회적 환경 변동 → 이사 계기.
 * - 합: 현 거처 정착 에너지 강화 → 이사 후 빠른 안정.
 */
function scoreMovingHouse(
  pillar: MonthPillar,
  base: { raw: number; hasDayChung: boolean; hasMonthChung: boolean; hasDayHap: boolean }
): ScoredDecision {
  let score = base.raw
  const reasons: string[] = []
  const { stemSipsung: stemSip, branchSipsung: branchSip, branch: mBranch } = pillar
  const stemCat = sipsungCategory(stemSip)
  const branchCat = sipsungCategory(branchSip)

  // 역마 지지: 이사의 핵심 에너지
  if (YEOKMA_BRANCHES.has(mBranch)) {
    score += 2.0
    reasons.push(`역마(驛馬) 지지(${mBranch}): 이동·변화의 기운이 최고조에 달해 이사를 결행하기에 에너지가 충분합니다.`)
  }

  // 편재 보정: 새 환경 개척
  if (stemSip === "편재") {
    score += 1.5
    reasons.push(`편재 월: 새로운 지역·환경으로의 확장 에너지가 강해 이사 후 새 출발에 매우 유리합니다.`)
  } else if (stemSip === "정재") {
    score += 0.8
    reasons.push(`정재 월: 안정적인 거주 환경 확보에 유리합니다. 임대차 계약이나 매매 계약 마무리에 적합합니다.`)
  }

  // 비겁 보정: 독립·분가 에너지
  if (stemCat === "비겁") {
    score += 1.0
    const detail = stemSip === "비견"
      ? "비견 월: 독립심이 강해져 주거 독립·분가 이사에 자연스러운 에너지가 형성됩니다."
      : "겁재 월: 강한 추진력으로 이사를 결행할 에너지가 충분합니다. 단, 충동적 결정은 피하세요."
    reasons.push(detail)
  }

  // 식신 보정: 안락한 이사 (편안한 새 보금자리)
  if (stemSip === "식신") {
    score += 0.8
    reasons.push(`식신 월: 편안하고 풍요로운 새 보금자리를 꾸리기에 길한 기운입니다. 의식주 안정운이 뒷받침됩니다.`)
  }

  // 정관: 안정 에너지 → 이사보다 현 거처 유지가 우선되지만, 계획적 이사에는 나쁘지 않음
  if (stemSip === "정관") {
    score -= 0.3
    reasons.push(`정관 월: 규율과 안정을 추구하는 달로, 이사보다는 현 거처에 뿌리를 내리는 시기에 더 맞습니다. 단, 계획적·절차적 이사에는 무방합니다.`)
  }

  // 지지 보정
  if (branchCat === "재성") {
    score += 0.8
    reasons.push(`월운 지지 ${branchSip}: 새 거처의 환경적 가치와 재물운이 강화됩니다.`)
  }
  if (branchCat === "비겁") {
    score += 0.5
    reasons.push(`월운 지지 ${branchSip}: 독립적인 새 공간 마련에 에너지가 뒷받침됩니다.`)
  }

  // 충·합 보정 (이사에서의 특수 해석)
  if (base.hasDayChung) {
    // 이사에서 일지 충은 거주지 변동 에너지 → 중립(약한 긍정)
    score += 0.5
    reasons.push(`일지(日支) 충(沖): 거주지 변동의 에너지가 강하게 작용하여 이사 결행 시기와 맞아떨어집니다. 다만 이사 후 정착에 시간이 필요할 수 있습니다.`)
  } else if (base.hasMonthChung) {
    score += 0.3
    reasons.push(`월지(月支) 충(沖): 주거 환경 변동의 외부 에너지가 이사 계획을 뒷받침합니다.`)
  }
  if (base.hasDayHap) {
    score += 1.2
    reasons.push(`일지 육합(六合): 새 거처에서의 정착·안정 에너지가 강해 이사 후 빠르게 새 환경에 적응하고 좋은 이웃·환경과 인연이 맺어집니다.`)
  }

  // 기본 근거: 항상 최소 1개 보장
  if (reasons.length === 0) {
    const baseDesc = base.raw >= 5
      ? `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하며, 이사를 진행하기에 무난한 에너지 흐름입니다.`
      : `${stemSip}(천간)·${branchSip}(지지) 기운이 작용하며, 이사 전 충분한 준비와 정착 계획이 필요한 시기입니다.`
    reasons.push(baseDesc)
  }

  return { score, reasons }
}

// ── 점수 → 등급 변환 ─────────────────────────────────────────────────────────

function toGrade(score: number): DecisionGrade {
  if (score >= 9) return "매우 좋음"
  if (score >= 7) return "좋음"
  if (score >= 5) return "보통"
  if (score >= 3) return "신중"
  return "불리"
}

/** 연속 실수 점수를 1~10 정수로 정규화 */
function normalizeScore(raw: number): number {
  return Math.max(1, Math.min(10, Math.round(raw)))
}

// ── 결정별 추천 로직 ──────────────────────────────────────────────────────────

function getRecommendation(
  thisScore: number,
  nextScore: number
): "이번 달" | "다음 달" | "둘 다 비슷" {
  const diff = thisScore - nextScore
  if (diff >= 1.5) return "이번 달"
  if (diff <= -1.5) return "다음 달"
  return "둘 다 비슷"
}

function buildSummary(
  type: DecisionType,
  recommendation: "이번 달" | "다음 달" | "둘 다 비슷",
  thisResult: DecisionMonthResult,
  nextResult: DecisionMonthResult,
  thisMonthLabel: string,
  nextMonthLabel: string
): string {
  const typeLabel = type === "이직" ? "이직" : type === "계약" ? "계약 체결" : "이사"
  const thisGrade = thisResult.grade
  const nextGrade = nextResult.grade

  if (recommendation === "이번 달") {
    return `${thisMonthLabel}이 ${typeLabel}에 더 유리합니다. (${thisMonthLabel}: ${thisGrade}, ${nextMonthLabel}: ${nextGrade})`
  }
  if (recommendation === "다음 달") {
    return `${nextMonthLabel}까지 기다리는 것이 ${typeLabel}에 유리합니다. (${thisMonthLabel}: ${thisGrade}, ${nextMonthLabel}: ${nextGrade})`
  }
  return `${thisMonthLabel}과 ${nextMonthLabel}이 ${typeLabel} 측면에서 큰 차이가 없습니다. (${thisGrade} / ${nextGrade})`
}

// ── 공개 함수 ─────────────────────────────────────────────────────────────────

/**
 * 결정 타이밍 DTO 생성.
 *
 * @param chart - calculateSajuChart 로 생성된 사주 차트
 * @param referenceDate - 기준일 (기본값: 현재 시각). 테스트 시 고정 날짜 주입 가능.
 * @returns 이직·계약·이사 세 결정에 대한 이번 달 vs 다음 달 비교 결과
 */
export function generateDecisionTiming(
  chart: SajuChartDto,
  referenceDate: Date = new Date()
): DecisionTimingDto {
  const dayStem = chart.dayHeavenlyStem as HeavenlyStem
  const dayBranch = chart.pillars.day.branch
  const monthBranch = chart.pillars.month.branch
  const strengthLevel = chart.strength.level

  // 이번 달 / 다음 달 계산 (연도 경계 처리 포함)
  const thisYear = referenceDate.getFullYear()
  const thisMonth = referenceDate.getMonth() + 1 // 1~12

  let nextYear: number
  let nextMonth: number
  if (thisMonth === 12) {
    nextYear = thisYear + 1
    nextMonth = 1
  } else {
    nextYear = thisYear
    nextMonth = thisMonth + 1
  }

  const thisLabel = `${thisYear}년 ${thisMonth}월`
  const nextLabel = `${nextYear}년 ${nextMonth}월`

  const thisPillar = getMonthPillar(thisYear, thisMonth, dayStem)
  const nextPillar = getMonthPillar(nextYear, nextMonth, dayStem)

  const thisBase = computeBaseScore(thisPillar, strengthLevel, dayBranch, monthBranch)
  const nextBase = computeBaseScore(nextPillar, strengthLevel, dayBranch, monthBranch)

  function buildResult(
    pillar: MonthPillar,
    base: ReturnType<typeof computeBaseScore>,
    scored: ScoredDecision,
    monthLabel: string
  ): DecisionMonthResult {
    const score = normalizeScore(scored.score)
    return {
      ganzhi: pillar.ganzhi,
      monthLabel,
      score,
      grade: toGrade(score),
      reasons: scored.reasons,
    }
  }

  const DECISION_CONFIGS: Array<{
    type: DecisionType
    icon: string
    scoreFn: (
      pillar: MonthPillar,
      base: ReturnType<typeof computeBaseScore>
    ) => ScoredDecision
  }> = [
    {
      type: "이직",
      icon: "💼",
      scoreFn: (p, b) => scoreJobChange(p, b, strengthLevel),
    },
    {
      type: "계약",
      icon: "📋",
      scoreFn: scoreContract,
    },
    {
      type: "이사",
      icon: "🏠",
      scoreFn: scoreMovingHouse,
    },
  ]

  const items: DecisionItem[] = DECISION_CONFIGS.map(({ type, icon, scoreFn }) => {
    const thisScoredRaw = scoreFn(thisPillar, thisBase)
    const nextScoredRaw = scoreFn(nextPillar, nextBase)

    const thisResult = buildResult(thisPillar, thisBase, thisScoredRaw, thisLabel)
    const nextResult = buildResult(nextPillar, nextBase, nextScoredRaw, nextLabel)

    const recommendation = getRecommendation(thisResult.score, nextResult.score)
    const summary = buildSummary(type, recommendation, thisResult, nextResult, thisLabel, nextLabel)

    return { type, icon, thisMonth: thisResult, nextMonth: nextResult, recommendation, summary }
  })

  const iso = [
    referenceDate.getFullYear(),
    String(referenceDate.getMonth() + 1).padStart(2, "0"),
    String(referenceDate.getDate()).padStart(2, "0"),
  ].join("-")

  return {
    items,
    referenceDate: iso,
    thisMonthLabel: thisLabel,
    nextMonthLabel: nextLabel,
  }
}
