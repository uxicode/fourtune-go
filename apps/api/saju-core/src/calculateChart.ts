import {
  calculateFourPillars,
  fourPillarsToString,
  lunarToSolar,
  type FourPillarsDetail,
  type BirthInfo,
} from "manseryeok"
import { computeDaeun } from "./daeun.js"
import { DEFAULT_DISCLAIMER_VERSION, getEngineVersion } from "./version.js"
import type {
  ChartRequestInput,
  PillarDto,
  PillarSipsungDto,
  SaeunEntryDto,
  SajuChartDto,
  SipsungNameDto,
} from "./types.js"
import { assertValidRequest } from "./validate.js"
import { computeSaeun } from "./saeun.js"
import { sipsungForPillar, type SipsungName } from "./sipsung.js"
import { estimateDayMasterStrength } from "./strength.js"
import { buildChartContent } from "./richContent.js"

function mapPillar(
  detail: FourPillarsDetail,
  key: "year" | "month" | "day" | "hour"
): PillarDto {
  const pillar = detail[key]
  const { ko, han, el, yy } = {
    year: {
      ko: detail.yearString,
      han: detail.yearHanja,
      el: detail.yearElement,
      yy: detail.yearYinYang,
    },
    month: {
      ko: detail.monthString,
      han: detail.monthHanja,
      el: detail.monthElement,
      yy: detail.monthYinYang,
    },
    day: {
      ko: detail.dayString,
      han: detail.dayHanja,
      el: detail.dayElement,
      yy: detail.dayYinYang,
    },
    hour: {
      ko: detail.hourString,
      han: detail.hourHanja,
      el: detail.hourElement,
      yy: detail.hourYinYang,
    },
  }[key]
  return {
    korean: ko,
    hanja: han,
    stem: pillar.heavenlyStem,
    branch: pillar.earthlyBranch,
    stemElement: el.stem,
    branchElement: el.branch,
    stemYinYang: yy.stem,
    branchYinYang: yy.branch,
  }
}

function toSipsungDto(p: { stem: SipsungName; branchFromMain: SipsungName }): PillarSipsungDto {
  return {
    stem: p.stem as SipsungNameDto,
    branchFromMain: p.branchFromMain as SipsungNameDto,
    branchNote: "main_hidden_stem",
  }
}

function toBirthInfo(input: ChartRequestInput): { info: BirthInfo; timeIsApproximate: boolean } {
  const unknown = input.unknownTimePolicy ?? "solar_noon"
  if (input.timeUnknown) {
    if (unknown !== "solar_noon")
      throw new Error("지원하지 않는 unknownTimePolicy 입니다.")
    return {
      info: {
        year: input.year,
        month: input.month,
        day: input.day,
        hour: 12,
        minute: 0,
        isLunar: input.kind === "lunar" ? true : undefined,
        isLeapMonth: input.kind === "lunar" ? input.isLeapMonth! : undefined,
      },
      timeIsApproximate: true,
    }
  }
  return {
    info: {
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute,
      isLunar: input.kind === "lunar" ? true : undefined,
      isLeapMonth: input.kind === "lunar" ? input.isLeapMonth! : undefined,
    },
    timeIsApproximate: false,
  }
}

function resolveSolarForLuck(input: ChartRequestInput): {
  y: number
  m: number
  d: number
  h: number
  mi: number
} {
  if (input.kind === "lunar") {
    const s = lunarToSolar(
      input.year,
      input.month,
      input.day,
      input.isLeapMonth ?? false
    )
    return {
      y: s.year,
      m: s.month,
      d: s.day,
      h: input.timeUnknown ? 12 : input.hour,
      mi: input.timeUnknown ? 0 : input.minute,
    }
  }
  return {
    y: input.year,
    m: input.month,
    d: input.day,
    h: input.timeUnknown ? 12 : input.hour,
    mi: input.timeUnknown ? 0 : input.minute,
  }
}

function mapFullChart(
  raw: FourPillarsDetail,
  timeIsApproximate: boolean,
  input: ChartRequestInput
): SajuChartDto {
  const dayStem = raw.day.heavenlyStem
  const sips = {
    year: toSipsungDto(sipsungForPillar(dayStem, raw.year)),
    month: toSipsungDto(sipsungForPillar(dayStem, raw.month)),
    day: toSipsungDto(sipsungForPillar(dayStem, raw.day)),
    hour: toSipsungDto(sipsungForPillar(dayStem, raw.hour)),
  }
  const strength = estimateDayMasterStrength(raw)
  const sol = resolveSolarForLuck(input)
  const daeun = computeDaeun({
    detail: raw,
    birth: { year: sol.y, month: sol.m, day: sol.d, hour: sol.h, minute: sol.mi },
    isMale: input.gender === "male",
  })
  const saeunY = input.saeunFromYear ?? new Date().getFullYear()
  const se = computeSaeun(dayStem, saeunY, 6)
  const saeun: SaeunEntryDto[] = se.map((e) => ({
    year: e.year,
    ganzhi: e.ganzhi,
    stemSipsung: e.stemSipsung as SipsungNameDto,
    branchSipsung: e.branchSipsung as SipsungNameDto,
  }))

  const pillars = {
    year: mapPillar(raw, "year"),
    month: mapPillar(raw, "month"),
    day: mapPillar(raw, "day"),
    hour: mapPillar(raw, "hour"),
  }
  return {
    engineVersion: getEngineVersion(),
    disclaimerVersion: DEFAULT_DISCLAIMER_VERSION,
    timeIsApproximate,
    summaryLine: fourPillarsToString(raw),
    dayHeavenlyStem: dayStem,
    gender: input.gender,
    pillars,
    elements: {
      year: { stem: raw.yearElement.stem, branch: raw.yearElement.branch },
      month: { stem: raw.monthElement.stem, branch: raw.monthElement.branch },
      day: { stem: raw.dayElement.stem, branch: raw.dayElement.branch },
      hour: { stem: raw.hourElement.stem, branch: raw.hourElement.branch },
    },
    sipsungByPillar: sips,
    strength,
    daeun,
    saeun,
    content: buildChartContent({ pillars, sipsungByPillar: sips }),
  }
}

export function calculateSajuChart(input: ChartRequestInput): SajuChartDto {
  assertValidRequest(input)
  const { info, timeIsApproximate } = toBirthInfo(input)
  const raw = calculateFourPillars(info)
  return mapFullChart(raw, timeIsApproximate, input)
}

export function calculateSajuChartFromBirthInfo(
  info: BirthInfo,
  meta: { gender: ChartRequestInput["gender"]; saeunFromYear?: number }
): SajuChartDto {
  const raw = calculateFourPillars(info)
  return mapFullChart(raw, false, {
    kind: "solar",
    year: info.year,
    month: info.month,
    day: info.day,
    hour: info.hour,
    minute: info.minute,
    timeUnknown: false,
    gender: meta.gender,
    saeunFromYear: meta.saeunFromYear,
  })
}
