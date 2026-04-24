import { calculateSajuChart } from "./calculateChart.js"
import { contentInterpretationLines } from "./richContent.js"
import type { ChartRequestInput, ChartWithInterpretation, SajuChartDto } from "./types.js"

/**
 * 전통·오행 기반 참고용 한 단락. 의료·투자·법률 조언이 아님을 전제로 합니다.
 */
export function interpretBasic(chart: SajuChartDto): string {
  const s = chart.sipsungByPillar
  const st = chart.strength
  const du = chart.daeun
  const su = chart.saeun
  const parts: string[] = [
    "이 결과는 만세력(manseryeok) 사주원국 + 앱 내부 콘텐츠 DB(60갑자·십성·격국 참고) + 십성·신강/신약·대운·세운(휴리스틱)을 덧붙인 참고용 풀이입니다. 방파·학파에 따라 해석이 다를 수 있습니다.",
    `연·월·일·시: ${chart.summaryLine}`,
    "",
    "[십성(일간 기준, 지지는 본기 1자)]",
    `년: 천간 ${s.year.stem} / 지지(본기) ${s.year.branchFromMain}`,
    `월: 천간 ${s.month.stem} / 지지(본기) ${s.month.branchFromMain}`,
    `일: 천간 ${s.day.stem} / 지지(본기) ${s.day.branchFromMain}`,
    `시: 천간 ${s.hour.stem} / 지지(본기) ${s.hour.branchFromMain}`,
    "",
    "[신강/신약(단순 점수, 참고)]",
    `수준: ${st.level} (점수 ${st.score.toFixed(1)})`,
    st.reasons.join(" "),
    "",
    "[대운]",
    `${du.forward ? "순행" : "역행"}, 첫 대운 ≈ ${du.firstStartAge}세(3일=1년 근사)`,
    du.steps
      .map(
        (x) => `${x.order}운 ${x.ganzhi} (만 ${x.fromAge}~${x.toAge}세)`
      )
      .join(" / "),
    "",
    "[세운(선택 기간, 양력 연도+중순·간지)]",
    su.map((e) => `${e.year}년 ${e.ganzhi} (천간${e.stemSipsung}/지(본기)${e.branchSipsung})`).join(" | "),
    "",
    `고지: 오락·참고 목적이며, 중요한 결정은 본인 판단과 전문가 상담을 권장합니다. (disclaimer v${chart.disclaimerVersion})`,
  ]
  if (chart.content) parts.push(...contentInterpretationLines(chart))
  return parts.join("\n")
}

export function chartWithInterpretation(input: ChartRequestInput): ChartWithInterpretation {
  const chart = calculateSajuChart(input)
  return {
    ...chart,
    interpretation: interpretBasic(chart),
  }
}
