import type { FiveElement, YinYang } from "manseryeok"
import type { GejuRow } from "./content/geju14.js"

export type CalendarKind = "solar" | "lunar"

export type Gender = "male" | "female"

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
}

export interface ChartWithInterpretation extends SajuChartDto {
  interpretation: string
}
