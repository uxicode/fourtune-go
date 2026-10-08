import type { FiveElement, YinYang } from "manseryeok"
export type { FiveElement, YinYang }
import type { GejuRow } from "./content/geju14.js"



export type CalendarKind = "solar" | "lunar"

export type Gender = "male" | "female"

/** 운세 서비스 모드: a(무료 맛보기), b(유료 상세) */
export type FortuneMode = "a" | "b"

/** 시를 모를 때: 정오(12:00)를 오시로 두어 ‘중앙 시진’에 해당시키는 정책(문서·UI와 일치). */
export type UnknownTimePolicy = "solar_noon"

export interface ChartRequestInput {
  kind: CalendarKind
  year: number
  month: number
  day: number
  hour: number
  minute: number
  /** 음력일 때만. */
  isLeapMonth?: boolean
  timeUnknown: boolean
  /** timeUnknown이면 solar_noon(12:00)으로 대체. */
  unknownTimePolicy?: UnknownTimePolicy
  gender: Gender
  saeunFromYear?: number
  /** 서비스 모드 ('a': 무료 맛보기, 'b': 유료 전체) */
  mode?: FortuneMode
}

export interface PillarDto {
  korean: string
  hanja: string
  stem: string
  branch: string
  stemElement: FiveElement
  branchElement: FiveElement
  stemYinYang: YinYang
  branchYinYang: YinYang
}

export type SipsungNameDto =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인"

export interface PillarSipsungDto {
  stem: SipsungNameDto
  branchFromMain: SipsungNameDto
  /** ‘지지는 본기(本氣) 1자 기준’ 안내. */
  branchNote: "main_hidden_stem"
}

export interface StrengthDto {
  level: "신강" | "중화" | "신약"
  score: number
  reasons: string[]
}

export interface DaeunStepDto {
  order: number
  ganzhi: string
  fromAge: number
  toAge: number
}

export interface DaeunDto {
  forward: boolean
  firstStartAge: number
  steps: DaeunStepDto[]
}

export interface SaeunEntryDto {
  year: number
  ganzhi: string
  stemSipsung: SipsungNameDto
  branchSipsung: SipsungNameDto
}

export interface Sipsin10BlurbDto {
  keywords: string
  socialMeaning: string
}

export interface SajuContentDto {
  version: string
  dayGanzhi60?: { title: string; body: string; tags: string[] }
  sipsinBlurbs: {
    year: { stem: Sipsin10BlurbDto; branch: Sipsin10BlurbDto }
    month: { stem: Sipsin10BlurbDto; branch: Sipsin10BlurbDto }
    day: { stem: Sipsin10BlurbDto; branch: Sipsin10BlurbDto }
    hour: { stem: Sipsin10BlurbDto; branch: Sipsin10BlurbDto }
  }
  gejuReference: GejuRow[]
}

export interface EasyInterpretationDto {
  oneLineSummary: string
  keywords: string[]
  dayMasterStory: {
    stem: string
    title: string
    symbol: string
    personality: string
    innerMind: string
  }
  gejuAnalysis: {
    detectedGeju: string
    code: string
    name: string
    badge: string
    meaning: string
    roleInLife: string
    advice: string
  }
  careerAndTalent: {
    title: string
    strengths: string[]
    recommendedFields: string
    workEnvironment: string
  }
  wealthStyle: {
    title: string
    pattern: string
    advice: string
  }
  relationshipStyle: {
    title: string
    description: string
    caution: string
  }
  elementBalance: {
    counts: Record<"목" | "화" | "토" | "금" | "수", number>
    strongest: string[]
    weakest: string[]
    prescriptions: string[]
  }
  luckAdvice: {
    currentYear: number
    currentYearGanzhi: string
    currentYearInsight: string
    lifeLesson: string
  }
  healthCare: {
    vulnerableAreas: string[]
    description: string
    lifestyleAdvice: string
  }
  lifeGuidance: {
    doNotDo: string[]
    cautions: string[]
    keepClose: string[]
    luckyElements: {
      colors: string
      items: string
      environment: string
    }
  }
  fortuneTiming: {
    peakLuck: {
      signs: string[]
      strategy: string
    }
    lowLuck: {
      signs: string[]
      strategy: string
    }
  }
}

/** Mode A & B 공통: 올해 간략 포인트형 운세 (총운·월별과 겹치지 않는 포인트형) */
export interface YearlyBriefFortuneDto {
  year: number
  yearGanzhi: string
  keyTheme: string
  briefKeypoint: string
  luckyAction: string
  cautionAction: string
}

/** Mode B 전용: 올해 총운 상세 분석 */
export interface YearlyFortuneDetailDto {
  year: number
  yearGanzhi: string
  summary: string
  careerLuck: string
  wealthLuck: string
  relationshipLuck: string
  healthLuck: string
  monthlyHighlight: string
}

/** Mode B 전용: 월별 운세 */
export interface MonthlyFortuneDto {
  month: number
  ganzhi: string
  solarMonthName: string
  keyword: string
  score: number // 1 ~ 5
  scoreLabel: string // "대길(大吉)" | "호조(好調)" | "평온(平穩)" | "신중(愼重)" | "수성(守成)"
  summary: string // 해당 월의 에너지 흐름 종합 총평
  career: string // 직업 & 사업 & 학업운 상세
  wealth: string // 재물 & 투자 & 소비운 상세
  relationship: string // 애정 & 대인관계 & 인연운 상세
  advice: string // 핵심 행동 팁 및 금기 사항
}

/** 결정 타이밍: 이직·계약·이사 각 결정에 대한 이번 달 vs 다음 달 비교 */
export type DecisionGrade = "매우 좋음" | "좋음" | "보통" | "신중" | "불리"

export interface DecisionMonthResult {
  ganzhi: string
  monthLabel: string
  score: number // 1~10
  grade: DecisionGrade
  reasons: string[]
}

export interface DecisionItem {
  type: "이직" | "계약" | "이사"
  icon: string
  thisMonth: DecisionMonthResult
  nextMonth: DecisionMonthResult
  recommendation: "이번 달" | "다음 달" | "둘 다 비슷"
  summary: string
}

export interface DecisionTimingDto {
  items: DecisionItem[]
  referenceDate: string
  thisMonthLabel: string
  nextMonthLabel: string
}

export interface SajuChartDto {
  engineVersion: string
  /** 면책·출처 문구 배포 버전(웹·API·PDF 공통). */
  disclaimerVersion: string
  timeIsApproximate: boolean
  summaryLine: string
  /** 일간(日干) — 십성·풀이 템플릿의 기준. */
  dayHeavenlyStem: string
  gender: Gender
  pillars: {
    year: PillarDto
    month: PillarDto
    day: PillarDto
    hour: PillarDto
  }
  elements: {
    year: { stem: FiveElement; branch: FiveElement }
    month: { stem: FiveElement; branch: FiveElement }
    day: { stem: FiveElement; branch: FiveElement }
    hour: { stem: FiveElement; branch: FiveElement }
  }
  sipsungByPillar: {
    year: PillarSipsungDto
    month: PillarSipsungDto
    day: PillarSipsungDto
    hour: PillarSipsungDto
  }
  strength: StrengthDto
  daeun: DaeunDto
  saeun: SaeunEntryDto[]
  /** 60갑자 일주·십성 키워드·격(참고) 등 앱 콘텐츠. */
  content?: SajuContentDto
  /** 누구나 쉽게 읽을 수 있는 종합 사주 풀이. */
  easyInterpretation?: EasyInterpretationDto
  /** 서비스 모드 ('a' | 'b') */
  mode?: FortuneMode
  /** 올해 간략 포인트형 운세 (Mode A, B 모두 포함) */
  yearlyBrief?: YearlyBriefFortuneDto
  /** Mode B 전용: 올해 총운 상세 리포트 */
  yearlyFortuneDetail?: YearlyFortuneDetailDto
  /** Mode B 전용: 12개월 월별 운세 */
  monthlyFortunes?: MonthlyFortuneDto[]
  /** Mode A & B 공통: 결정 타이밍 (이직·계약·이사) */
  decisionTiming?: DecisionTimingDto
}

export interface ChartWithInterpretation extends SajuChartDto {
  interpretation: string
}


