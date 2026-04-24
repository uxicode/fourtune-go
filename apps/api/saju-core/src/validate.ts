import type { ChartRequestInput } from "./types.js"

const YEAR_MIN = 1900
const YEAR_MAX = 2100

export class SajuValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SajuValidationError"
  }
}

function assertRange(name: string, v: number, min: number, max: number) {
  if (!Number.isInteger(v) || v < min || v > max)
    throw new SajuValidationError(`${name}는 ${min}~${max} 정수여야 합니다.`)
}

export function assertValidRequest(input: ChartRequestInput): void {
  assertRange("연", input.year, YEAR_MIN, YEAR_MAX)
  assertRange("월", input.month, 1, 12)
  assertRange("일", input.day, 1, 31)
  if (!input.timeUnknown) {
    assertRange("시", input.hour, 0, 23)
    assertRange("분", input.minute, 0, 59)
  }
  if (input.kind === "lunar" && input.isLeapMonth === undefined)
    throw new SajuValidationError("음력일 때 isLeapMonth(윤달 여부)가 필요합니다.")
  if (input.gender !== "male" && input.gender !== "female")
    throw new SajuValidationError("gender는 male 또는 female 이어야 합니다.")
  if (input.saeunFromYear !== undefined)
    assertRange("세운 시작 연", input.saeunFromYear, YEAR_MIN, YEAR_MAX)
}

export { YEAR_MAX, YEAR_MIN }
