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
  const easy = chart.easyInterpretation

  const parts: string[] = []

  if (chart.mode === "a") {
    parts.push(
      "========================================",
      "🌱 [사주 맛보기 요약 - 무료 모드 A]",
      `▶ 한 줄 총평: ${easy ? easy.oneLineSummary : chart.summaryLine}`,
      `▶ 핵심 키워드: ${easy ? easy.keywords.join(" · ") : ""}`,
      "========================================",
      ""
    )
    if (chart.yearlyBrief) {
      parts.push(
        `[올해(${chart.yearlyBrief.year}년 ${chart.yearlyBrief.yearGanzhi}년) 간략 운세]`,
        `· 핵심 테마: ${chart.yearlyBrief.keyTheme}`,
        `· 운세 포인트: ${chart.yearlyBrief.briefKeypoint}`,
        `· 행운을 부르는 행동: ${chart.yearlyBrief.luckyAction}`,
        `· 올해 주의할 행동: ${chart.yearlyBrief.cautionAction}`,
        "",
        "🔒 [유료 모드 B 전용 콘텐츠]",
        "  - 12가지 성향/격국/직업/재물/애정/건강/개운 종합 풀이 리포트",
        "  - 올해 총운 상세 심층 분석 (직업·재물·애정·건강 종합)",
        "  - 1월부터 12월까지 월별 상세 운세 및 행동 전략",
        ""
      )
    }
  } else if (easy) {
    parts.push(
      "========================================",
      "🌟 [알기 쉬운 사주 종합 풀이 - 유료 모드 B]",
      `▶ 한 줄 요약: ${easy.oneLineSummary}`,
      `▶ 핵심 키워드: ${easy.keywords.join(" · ")}`,
      "========================================",
      "",
      `1. 타고난 성향과 본질 (${easy.dayMasterStory.stem} - ${easy.dayMasterStory.symbol})`,
      easy.dayMasterStory.personality,
      `[내면 심리] ${easy.dayMasterStory.innerMind}`,
      "",
      `2. 중심 격국: ${easy.gejuAnalysis.name} [${easy.gejuAnalysis.badge}]`,
      `· 의미: ${easy.gejuAnalysis.meaning}`,
      `· 사회적 역할: ${easy.gejuAnalysis.roleInLife}`,
      `· 조언: ${easy.gejuAnalysis.advice}`,
      "",
      `3. 직업 및 적성: ${easy.careerAndTalent.title}`,
      `· 핵심 강점: ${easy.careerAndTalent.strengths.join(", ")}`,
      `· 추천 분야: ${easy.careerAndTalent.recommendedFields}`,
      `· 적합 환경: ${easy.careerAndTalent.workEnvironment}`,
      "",
      `4. 재물운과 인간관계`,
      `· 재물 스타일: [${easy.wealthStyle.title}] ${easy.wealthStyle.pattern}`,
      `· 재물 조언: ${easy.wealthStyle.advice}`,
      `· 인간관계: ${easy.relationshipStyle.description}`,
      `· 관계 유의점: ${easy.relationshipStyle.caution}`,
      "",
      `5. 오행(목·화·토·금·수) 밸런스와 행운 개운법`,
      `· 오행 분포: 목(${easy.elementBalance.counts.목}) 화(${easy.elementBalance.counts.화}) 토(${easy.elementBalance.counts.토}) 금(${easy.elementBalance.counts.금}) 수(${easy.elementBalance.counts.수})`,
      `· 개운 처방:`,
      ...easy.elementBalance.prescriptions.map((p) => `  - ${p}`),
      "",
      `6. 건강 관리 및 주의 장기`,
      `· 취약 부위: ${easy.healthCare.vulnerableAreas.join(", ")}`,
      `· ${easy.healthCare.description}`,
      `· 생활 수칙: ${easy.healthCare.lifestyleAdvice}`,
      "",
      `7. 하지 말아야 할 것 & 조심해야 할 것`,
      `[금기 사항 - 피해야 할 행동]`,
      ...easy.lifeGuidance.doNotDo.map((d) => `  ✕ ${d}`),
      `[주의 사항 - 일상 속 경계]`,
      ...easy.lifeGuidance.cautions.map((c) => `  ! ${c}`),
      "",
      `8. 가까이 할 것 & 행운 팁`,
      `[도움이 되는 사람/환경/습관]`,
      ...easy.lifeGuidance.keepClose.map((k) => `  ○ ${k}`),
      `· 행운의 색상: ${easy.lifeGuidance.luckyElements.colors}`,
      `· 행운의 소품: ${easy.lifeGuidance.luckyElements.items}`,
      `· 행운의 공간: ${easy.lifeGuidance.luckyElements.environment}`,
      "",
      `9. 운의 흐름: 운수 대통할 때 vs 운수 안 좋을 때`,
      `[운수 대통할 때 (상승기 징조)]`,
      ...easy.fortuneTiming.peakLuck.signs.map((s) => `  ▲ ${s}`),
      `· 행동 전략: ${easy.fortuneTiming.peakLuck.strategy}`,
      `[운수 안 좋을 때 (침체기 징조)]`,
      ...easy.fortuneTiming.lowLuck.signs.map((s) => `  ▼ ${s}`),
      `· 극복 전략: ${easy.fortuneTiming.lowLuck.strategy}`,
      "",
      `10. 올해(${easy.luckAdvice.currentYear}년 ${easy.luckAdvice.currentYearGanzhi}년) 운세와 인생 조언`,
      `· 올해 흐름: ${easy.luckAdvice.currentYearInsight}`,
      `· 마음에 새길 말: ${easy.luckAdvice.lifeLesson}`,
      ""
    )

    if (chart.yearlyFortuneDetail) {
      const yf = chart.yearlyFortuneDetail
      parts.push(
        "----------------------------------------",
        `🔮 [올해(${yf.year}년 ${yf.yearGanzhi}년) 총운 심층 리포트]`,
        "----------------------------------------",
        `· 종합 총평: ${yf.summary}`,
        `· 직업/사업운: ${yf.careerLuck}`,
        `· 재물/투자운: ${yf.wealthLuck}`,
        `· 애정/대인운: ${yf.relationshipLuck}`,
        `· 건강/활력운: ${yf.healthLuck}`,
        `· 연간 하이라이트: ${yf.monthlyHighlight}`,
        ""
      )
    }

    if (chart.monthlyFortunes && chart.monthlyFortunes.length > 0) {
      parts.push(
        "----------------------------------------",
        `📅 [12개월 월별 운세 흐름]`,
        "----------------------------------------"
      )
      for (const m of chart.monthlyFortunes) {
        parts.push(
          `▶ ${m.solarMonthName} (${m.ganzhi}월) - [${m.scoreLabel} ★${m.score}/5] #${m.keyword}`,
          `· 총평: ${m.summary}`,
          `· 직업/사업: ${m.career}`,
          `· 재물/투자: ${m.wealth}`,
          `· 애정/대인: ${m.relationship}`,
          `· 행동 팁: ${m.advice}`,
          ""
        )
      }
    }

    parts.push(
      "----------------------------------------",
      "[상세 명리학 원국 및 만세력 지표 (참고용)]",
      "----------------------------------------"
    )
  }



  parts.push(
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
  )
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
