/** @fortune/saju-core package version (bump with releases). */
export const SAJU_CORE_VERSION = "0.2.0"

/** Pinned to match [packages/saju-core/package.json] dependency. */
export const MANSERYEOK_VERSION = "1.0.1"

export function getEngineVersion(): string {
  return `manseryeok@${MANSERYEOK_VERSION}+saju-core@${SAJU_CORE_VERSION}+analysis@1`
}

export const DEFAULT_DISCLAIMER_VERSION = "1.1.0"
