/**
 * 절기 일자 근사: manseryeok 내부와 동일 계수(참고: MIT, yhj1024/manseryeok dist).
 * 24절기 중 0,1… 인덱스.
 */
const SOLAR_TERM_BASE = [
  5.4055, 20.12, 3.87, 18.73, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04, 5.678, 21.37, 7.108, 22.83, 7.5,
  23.13, 7.646, 23.042, 8.318, 23.438, 7.438, 22.36, 7.18, 21.94,
]

export function getSolarTermDate(year: number, termIndex: number): Date {
  const century = Math.floor(year / 100)
  const yearInCentury = year % 100
  const termCoeff = 0.2422
  const leapYearAdjust = Math.floor(yearInCentury / 4) - Math.floor(century / 4)
  const day = Math.floor(
    SOLAR_TERM_BASE[termIndex] + termCoeff * yearInCentury + leapYearAdjust
  )
  const month = Math.floor(termIndex / 2)
  return new Date(year, month, day, 0, 0, 0, 0)
}

/** 12절(節) index — 大運 童限(순/역)에서 사용(만세력 月界). 立春,驚蟄,…,小寒 */
export const TERM_INDEX_JIE_12 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0] as const

export function collectJieInstantsAroundYear(centerYear: number): Date[] {
  const out: Date[] = []
  for (const y of [centerYear - 1, centerYear, centerYear + 1]) {
    for (const t of TERM_INDEX_JIE_12) {
      out.push(getSolarTermDate(y, t))
    }
  }
  return out.sort((a, b) => a.getTime() - b.getTime())
}

export function getNextJie(birth: Date): Date {
  const y = birth.getFullYear()
  const list = collectJieInstantsAroundYear(y)
  const t = birth.getTime()
  for (const d of list) {
    if (d.getTime() > t) return d
  }
  return collectJieInstantsAroundYear(y + 1).find((d) => d.getTime() > t) ?? list[list.length - 1]
}

export function getPreviousJie(birth: Date): Date {
  const y = birth.getFullYear()
  const list = collectJieInstantsAroundYear(y)
  const t = birth.getTime()
  let best: Date | null = null
  for (const d of list) {
    if (d.getTime() < t) best = d
  }
  if (best) return best
  return collectJieInstantsAroundYear(y - 1)
    .filter((d) => d.getTime() < t)
    .sort((a, b) => b.getTime() - a.getTime())[0]!
}

/** 입춘(절 index 2) */
export function getLichun(year: number): Date {
  return getSolarTermDate(year, 2)
}

/**
 * 四柱 연주와 동일한 기준: 생일 &lt; 올해 입춘이면 年(간지)은 전년.
 */
export function getBaziSolarYear(utcLikeLocal: Date): number {
  const y = utcLikeLocal.getFullYear()
  const lichun = getLichun(y)
  return utcLikeLocal.getTime() < lichun.getTime() ? y - 1 : y
}

/** 양력 기준 년주(입춘 기준) — 流年. */
export function ganzhiForSolarYear(adjustedYear: number): { stem: number; branch: number } {
  return {
    stem: ((adjustedYear - 4) % 10 + 10) % 10,
    branch: ((adjustedYear - 4) % 12 + 12) % 12,
  }
}

export function toBirthDate(yyyy: number, mm: number, dd: number, hour: number, minute: number): Date {
  return new Date(yyyy, mm - 1, dd, hour, minute, 0, 0)
}
