/**
 * API `POST /v1/charts` 응답과 맞춘 프론트 전용 타입(백엔드 `saju-core`와 동형).
 * `manseryeok`에 의존하지 않기 위해 유니온으로 둡니다.
 */
export type CalendarKind = "solar" | "lunar"
export type Gender = "male" | "female"
export type FortuneMode = "a" | "b"

type FiveElement = "목" | "화" | "토" | "금" | "수"
type YinYang = "양" | "음"

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

export interface GejuRow {
  code: string
  name: string
  description: string
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

export interface ChartRequestInput {
  kind: CalendarKind
  year: number
  month: number
  day: number
  hour: number
  minute: number
  isLeapMonth?: boolean
  timeUnknown: boolean
  unknownTimePolicy?: "solar_noon"
  gender: Gender
  saeunFromYear?: number
  mode?: FortuneMode
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

/** Mode A & B 공통: 올해 간략 포인트형 운세 */
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

export interface SajuChartDto {
  engineVersion: string
  disclaimerVersion: string
  timeIsApproximate: boolean
  summaryLine: string
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
  content?: SajuContentDto
  easyInterpretation?: EasyInterpretationDto
  mode?: FortuneMode
  yearlyBrief?: YearlyBriefFortuneDto
  yearlyFortuneDetail?: YearlyFortuneDetailDto
  monthlyFortunes?: MonthlyFortuneDto[]
}

export interface ChartWithInterpretation extends SajuChartDto {
  interpretation: string
}


