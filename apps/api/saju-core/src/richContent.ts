import { GEJU_REFERENCE, type GejuRow } from "./content/geju14.js"
import { GANZHI_60, type Ganzhi60Block } from "./content/ganzhi60.js"
import { SIPSIN_10 } from "./content/sipsin10.js"
import type {
  PillarDto,
  PillarSipsungDto,
  SajuChartDto,
  SipsungNameDto,
  SajuContentDto,
  Sipsin10BlurbDto,
} from "./types.js"

export { GANZHI_60 } from "./content/ganzhi60.js"
export { SIPSIN_10 } from "./content/sipsin10.js"
export { GEJU_REFERENCE, type GejuRow } from "./content/geju14.js"

const CONTENT_VERSION = "1.0.0" as const

export function lookupDayPillar60(day: PillarDto | string): Ganzhi60Block | undefined {
  const k = typeof day === "string" ? day : day.korean
  return GANZHI_60[k]
}

function blurbForSipsung(name: SipsungNameDto): Sipsin10BlurbDto {
  return SIPSIN_10[name]
}

export function blurbsForPillarSipsung(p: PillarSipsungDto): {
  stem: Sipsin10BlurbDto
  branch: Sipsin10BlurbDto
} {
  return {
    stem: blurbForSipsung(p.stem),
    branch: blurbForSipsung(p.branchFromMain),
  }
}

export function buildChartContent(
  chart: Pick<SajuChartDto, "pillars" | "sipsungByPillar">,
): SajuContentDto {
  const s = chart.sipsungByPillar
  return {
    version: CONTENT_VERSION,
    dayGanzhi60: lookupDayPillar60(chart.pillars.day),
    sipsinBlurbs: {
      year: blurbsForPillarSipsung(s.year),
      month: blurbsForPillarSipsung(s.month),
      day: blurbsForPillarSipsung(s.day),
      hour: blurbsForPillarSipsung(s.hour),
    },
    gejuReference: [...GEJU_REFERENCE],
  }
}

/**
 * `interpretation` 텍스트에 이어 붙는 본문(60갑자·십성·격 참고).
 */
export function contentInterpretationLines(chart: SajuChartDto): string[] {
  const c = chart.content
  if (!c) return []

  const lines: string[] = [
    "",
    "[앱 콘텐츠 DB(참고) + 만세력, 오락·참고]",
    "아래 60갑자·십성 키워드·격국 표는 앱이 넣는 설명이며, 학파·해석이 다를 수 있습니다.",
  ]

  if (c.dayGanzhi60) {
    lines.push(
      "",
      `· 일주(60갑자): ${c.dayGanzhi60.title}`,
      c.dayGanzhi60.body,
      c.dayGanzhi60.tags.join(" "),
    )
  }

  lines.push("", "· 십성 키워드(기둥별, 천간/지지 본기)")

  for (const { label, key } of [
    { label: "년", key: "year" as const },
    { label: "월", key: "month" as const },
    { label: "일", key: "day" as const },
    { label: "시", key: "hour" as const },
  ]) {
    const b = c.sipsinBlurbs[key]
    lines.push(
      `  ${label} — 천간: [${b.stem.keywords}] ${b.stem.socialMeaning}`,
    )
    lines.push(
      `         지(본기): [${b.branch.keywords}] ${b.branch.socialMeaning}`,
    )
  }

  lines.push(
    "",
    "· 격국 참고(자동 1개 판정 없음 — 아래는 전부 참고용 나열, 전통 판정과 다를 수 있음):",
    ...c.gejuReference.map((g) => `  [${g.code}] ${g.name} — ${g.description}`),
  )

  return lines
}
