import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  type HeavenlyStem,
  type EarthlyBranch,
} from "manseryeok"
import { ganzhiForSolarYear } from "./solarTerms.js"
import { sipsungForStems, sipsungForBranchMain } from "./sipsung.js"
import type {
  SajuChartDto,
  YearlyBriefFortuneDto,
  YearlyFortuneDetailDto,
  MonthlyFortuneDto,
  SipsungNameDto,
} from "./types.js"

// 연두법(遁月法): 년간(HeavenlyStem)에 따라 인월(1월) 천간 결정
function getMonthStemIndex(yearStemIndex: number, monthOrder: number): number {
  // monthOrder: 0 for 寅월(보통 첫째달), 1 for 卯월 ... 11 for 丑월
  const firstStemIndex = ((yearStemIndex % 5) * 2 + 2) % 10
  return (firstStemIndex + monthOrder) % 10
}

// 6충(六沖): 자오, 축미, 인신, 묘유, 진술, 사해
const CHUNG_MAP: Record<string, string> = {
  子: "午", 午: "子",
  丑: "未", 未: "丑",
  寅: "申", 申: "寅",
  卯: "酉", 酉: "卯",
  辰: "戌", 戌: "辰",
  巳: "亥", 亥: "巳",
}

// 6합(六合): 자축, 인해, 묘술, 진유, 사신, 오미
const HAP_MAP: Record<string, string> = {
  子: "丑", 丑: "子",
  寅: "亥", 亥: "寅",
  卯: "戌", 戌: "卯",
  辰: "酉", 酉: "辰",
  巳: "申", 申: "巳",
  午: "未", 未: "午",
}

function isChung(b1: string, b2: string): boolean {
  return CHUNG_MAP[b1] === b2
}

function isHap(b1: string, b2: string): boolean {
  return HAP_MAP[b1] === b2
}

/**
 * Mode A & B 공통: 올해 간략 포인트형 운세
 * (총운 및 월별 상세와 중복되지 않는 핵심 테마와 1문장 키포인트, 행운/주의 행동)
 */
export function generateYearlyBriefFortune(
  chart: SajuChartDto,
  targetYear = new Date().getFullYear()
): YearlyBriefFortuneDto {
  const dayStem = chart.dayHeavenlyStem as HeavenlyStem
  const { stem: yearStemIdx, branch: yearBranchIdx } = ganzhiForSolarYear(targetYear)
  const yearStem = HEAVENLY_STEMS[yearStemIdx]
  const yearBranch = EARTHLY_BRANCHES[yearBranchIdx]
  const yearGanzhi = `${yearStem}${yearBranch}`

  const stemSipsung = sipsungForStems(dayStem, yearStem) as SipsungNameDto
  const branchSipsung = sipsungForBranchMain(dayStem, yearBranch) as SipsungNameDto

  const briefThemeMap: Record<SipsungNameDto, { theme: string; point: string; lucky: string; caution: string }> = {
    비견: {
      theme: "자립과 주도성 확립의 해",
      point: "자신의 뜻을 확고히 세우고 독립적인 입지를 다지기에 유리한 시기입니다.",
      lucky: "동료나 지인과의 협력 프로젝트, 자기 계발 및 역량 강화 스터디",
      caution: "지나친 고집으로 인한 마찰이나 독단적인 결정",
    },
    겁재: {
      theme: "선의의 경쟁과 내실 관리의 해",
      point: "주변 환경이 역동적으로 움직이며, 승부욕과 추진력이 빛을 발할 수 있습니다.",
      lucky: "명확한 목표 설정과 페이스 조절, 전문 멘토와의 소통",
      caution: "충동적인 투자나 금전 거래, 불필요한 비교의식",
    },
    식신: {
      theme: "재능 발휘와 풍요로운 결실의 해",
      point: "창의적인 아이디어가 샘솟고 자신이 좋아하는 일에 몰입하여 성과를 내기 좋습니다.",
      lucky: "취미의 전문화, 새로운 기술 습득, 가족 및 소중한 이들과의 미식",
      caution: "과도한 긴장 완화나 나태함, 무계획적인 일정 관리",
    },
    상관: {
      theme: "혁신과 새로운 도전의 해",
      point: "기존의 틀을 깨고 색다른 영역으로 영역을 넓히는 기운이 강한 해입니다.",
      lucky: "자기 표현 및 브랜딩, 기획안 발표, 새로운 취미나 언어 학습",
      caution: "감정적인 언행이나 조직 규율과의 정면충돌",
    },
    편재: {
      theme: "기회 포착과 활동 영역 확장의 해",
      point: "활동 범위가 넓어지고 다채로운 기회와 인연이 다가오는 생동감 넘치는 시기입니다.",
      lucky: "네트워킹 확장, 다각화된 시야 확보, 시장 트렌드 파악",
      caution: "과욕으로 벌려놓은 일의 수습 미흡, 일확천금 심리",
    },
    정재: {
      theme: "안정적 자산 형성 및 성실한 축적의 해",
      point: "꾸준한 노력과 원칙 있는 태도가 가장 확실한 결실로 이어지는 안전운입니다.",
      lucky: "가계부 정돈, 장기 저축 플랜 실행, 일상의 규칙적인 루틴 유지",
      caution: "변화에 대한 지나친 두려움이나 융통성 부족",
    },
    편관: {
      theme: "위기 극복과 도약의 해",
      point: "책임감과 도전 과제가 주어지며, 이를 극복했을 때 큰 성장을 이루게 됩니다.",
      lucky: "체력 단련 및 규칙적 운동, 체계적인 우선순위 정리",
      caution: "무리한 과로와 스트레스 누적, 극단적인 승부수",
    },
    정관: {
      theme: "명예 상승과 신뢰 구축의 해",
      point: "사회적 인정과 안정적인 신뢰를 얻으며 공적인 일에서 두각을 나타냅니다.",
      lucky: "자격증 취득, 조직 내 신뢰 제고, 공적인 약속 준수",
      caution: "형식주의에 얽매여 속도를 늦추거나 경직된 사고",
    },
    편인: {
      theme: "전문 지식 심화와 통찰력의 해",
      point: "직관과 깊이 있는 탐구력이 높아져 전문 분야 연구나 기획에 매우 유리합니다.",
      lucky: "독서와 사색, 전문 자격 공부, 예술/인문학적 취미",
      caution: "부정적인 잡념이나 의심, 현실 감각 결여",
    },
    정인: {
      theme: "귀인의 조력과 온화한 성장의 해",
      point: "주변의 따뜻한 지원과 문서운이 따르며, 마음의 여유를 되찾는 순조로운 해입니다.",
      lucky: "윗사람이나 스승에게 조언 구하기, 계약서 및 증명서 점검",
      caution: "수동적인 태도로 찾아온 좋은 기회를 흘려보내는 것",
    },
  }

  const base = briefThemeMap[stemSipsung] || briefThemeMap.정재

  return {
    year: targetYear,
    yearGanzhi,
    keyTheme: base.theme,
    briefKeypoint: `${yearGanzhi}년 세운의 ${stemSipsung} 기운을 맞아, ${base.point} (지지 ${branchSipsung} 기반)`,
    luckyAction: base.lucky,
    cautionAction: base.caution,
  }
}

/**
 * Mode B 전용: 올해 총운 상세 분석
 */
export function generateYearlyFortuneDetail(
  chart: SajuChartDto,
  targetYear = new Date().getFullYear()
): YearlyFortuneDetailDto {
  const dayStem = chart.dayHeavenlyStem as HeavenlyStem
  const { stem: yearStemIdx, branch: yearBranchIdx } = ganzhiForSolarYear(targetYear)
  const yearStem = HEAVENLY_STEMS[yearStemIdx]
  const yearBranch = EARTHLY_BRANCHES[yearBranchIdx]
  const yearGanzhi = `${yearStem}${yearBranch}`

  const stemSipsung = sipsungForStems(dayStem, yearStem) as SipsungNameDto
  const branchSipsung = sipsungForBranchMain(dayStem, yearBranch) as SipsungNameDto
  const strengthLevel = chart.strength.level

  const summary = `${targetYear}년(${yearGanzhi}년)은 일간 ${dayStem}에게 천간 '${stemSipsung}', 지지 '${branchSipsung}'의 기운이 강하게 작용하는 한 해입니다. 원국의 ${strengthLevel} 상태와 조화를 이루며, 전반적으로 ${
    strengthLevel === "신강"
      ? "자신의 에너지를 생산적이고 외부적인 결과물로 승화시키기에 최적화된 흐름"
      : strengthLevel === "신약"
      ? "주변의 도움과 내면의 실력을 탄탄히 축적하며 실속을 챙기는 흐름"
      : "오행의 중화 기운을 바탕으로 큰 굴곡 없이 균형 잡힌 성장을 이뤄가는 흐름"
  }을 보입니다.`

  const careerBySipsung: Record<SipsungNameDto, string> = {
    비견: "동료나 파트너와의 협업 시너지가 크게 발휘되는 시기입니다. 다만 주도권 다툼을 피하고 명확한 역할 분담이 성공의 열쇠입니다.",
    겁재: "강한 승부욕이 생겨 경쟁 상황에서 유리한 고지를 점할 수 있습니다. 무리한 단독 진행보다는 신뢰할 수 있는 조력자와 함께하세요.",
    식신: "창의적인 재능과 전문 기술이 돋보입니다. 새로운 프로젝트 론칭이나 창작 활동에서 기대 이상의 호평을 받게 됩니다.",
    상관: "기존의 비효율을 개선하고 혁신적인 아이디어를 제시하여 주목받습니다. 단, 상사나 조직과의 소통에서 유연함이 필요합니다.",
    편재: "새로운 사업 아이템이나 신규 시장 개척에 큰 운이 따릅니다. 과감한 도전이 결실을 맺을 가능성이 높습니다.",
    정재: "맡은 바 직무를 성실히 수행하여 인정받고 보상이 따르는 안정적인 해입니다. 계약 갱신 및 승진에 매우 길합니다.",
    편관: "다소 벅찬 책임과 중책이 주어질 수 있으나, 이를 해결해내며 조직 내 핵심 인재로 거듭나는 전환점이 됩니다.",
    정관: "공적인 승진, 합격, 영전운이 매우 강합니다. 조직 내 신뢰도가 높아져 리더십을 발휘하기에 최적인 시기입니다.",
    편인: "특수 기술, 자격증, 연구 및 학술 분야에서 독보적인 성과를 냅니다. 번뜩이는 아이디어가 무기가 됩니다.",
    정인: "상사나 윗사람의 든든한 후원과 결재운이 따릅니다. 자격증 취득 및 공공 프로젝트 참여에 매우 유리합니다.",
  }

  const wealthBySipsung: Record<SipsungNameDto, string> = {
    비견: "고정 수입은 안정적이나 지인과의 관계에서 발생하는 지출 관리가 필요합니다. 공동 투자는 계약서를 명확히 하세요.",
    겁재: "큰 돈이 오갈 수 있는 역동적인 해입니다. 충동적인 베팅이나 고위험 투자는 피하고 안전 자산 비중을 늘리세요.",
    식신: "자신의 기술과 생산 활동을 통해 자연스럽게 부가 창출되는 순풍의 운입니다. 식음료, 문화, 생산 분야 투자가 유망합니다.",
    상관: "남들이 보지 못하는 틈새 기회를 포착하여 부가 수익을 올릴 수 있습니다. 지출 충동을 절제하면 목돈을 모을 수 있습니다.",
    편재: "유통, 부업, 투자 등에서 의외의 목돈 유입 가능성이 높습니다. 얻은 이익의 일부는 반드시 안전 자산으로 전환해 두세요.",
    정재: "정기적인 저축과 계획된 자산 증식이 돋보입니다. 티끌 모아 태산을 이루는 탄탄한 재정 안정을 누릴 수 있습니다.",
    편관: "예기치 못한 지출이나 공과금, 수리비 등이 발생할 수 있으므로 비상금을 넉넉히 확보하는 운용이 필요합니다.",
    정관: "정당한 보상과 연봉 인상, 인센티브 등 정직한 소득이 늘어납니다. 보수적인 포트폴리오 유지가 길합니다.",
    편인: "아이디어나 지식재산권, 부동산 관련 문서 계약에 유리한 기운입니다. 사기성 정보에 현혹되지 않도록 주의하세요.",
    정인: "문서운과 상속, 지원금 등 제3자의 도움이 재정에 긍정적인 영향을 줍니다. 장기적인 안목의 저축이 유리합니다.",
  }

  const relationBySipsung: Record<SipsungNameDto, string> = {
    비견: "친구 같은 편안한 관계가 발전하기 좋습니다. 다만 연인 사이에서 자존심 싸움은 피하는 것이 좋습니다.",
    겁재: "열정적인 만남이 가능하나 감정의 기복이 있을 수 있습니다. 상대방을 배려하고 소통에 귀 기울이세요.",
    식신: "온화하고 다정한 분위기가 형성되어 연인이나 가족과의 유대감이 깊어집니다. 솔로는 자연스러운 모임에서 인연을 만납니다.",
    상관: "매력과 표현력이 빛나 이성의 호감을 쉽게 얻습니다. 다만 무심코 던진 말이 오해를 부르지 않도록 주의하세요.",
    편재: "인간관계의 폭이 넓어지고 매력적인 인연들이 다가옵니다. 진중한 태도로 옥석을 가리는 지혜가 필요합니다.",
    정재: "진지하고 신뢰할 수 있는 관계가 구축됩니다. 미혼은 결혼을 전제로 한 발전이 기대되는 안정적인 흐름입니다.",
    편관: "카리스마 있는 인연을 만나거나 관계에서 주도권 조율이 필요한 시기입니다. 서로의 경계를 존중하세요.",
    정관: "예의 바르고 사회적으로 반듯한 인연과의 발전이 유력합니다. 가정이나 커플 간의 안정감이 매우 높습니다.",
    편인: "정신적 공감대를 나눌 수 있는 깊이 있는 인연이 다가옵니다. 혼자만의 시간과 상대방과의 교류 간 균형을 맞추세요.",
    정인: "배려심 깊은 사람들의 도움과 사랑을 받습니다. 따뜻한 온기가 감도는 한 해가 됩니다.",
  }

  const healthLuck = `오행 중 상대적으로 약한 기운의 균형을 맞추는 것이 중요합니다. 특히 환절기 면역 관리와 규칙적인 수면 습관이 필수적이며, 과도한 정신적 피로를 해소하기 위해 자연 속 힐링을 추천합니다.`
  const monthlyHighlight = `올해는 특히 봄에서 초여름으로 이어지는 시기(양력 3~6월)에 새로운 기회의 싹이 트고, 가을 수확기(양력 9~11월)에 노력의 결실이 가시화됩니다. 한여름에는 무리한 확장보다 컨디션 관리에 집중하는 것이 좋습니다.`

  return {
    year: targetYear,
    yearGanzhi,
    summary,
    careerLuck: careerBySipsung[stemSipsung] || careerBySipsung.정재,
    wealthLuck: wealthBySipsung[stemSipsung] || wealthBySipsung.정재,
    relationshipLuck: relationBySipsung[stemSipsung] || relationBySipsung.정재,
    healthLuck,
    monthlyHighlight,
  }
}

/**
 * Mode B 전용: 12개월 월별 운세 생성
 * 사주의 신강/신약, 십성의 희기신, 일지/월지와의 충(沖) 및 합(合)을 엄격히 판정하여
 * 1~5점까지의 실질적인 운세 굴곡과 깊이 있는 상세 풀이(총평, 직업, 재물, 애정, 조언)를 생성합니다.
 */
export function generateMonthlyFortunes(
  chart: SajuChartDto,
  targetYear = new Date().getFullYear()
): MonthlyFortuneDto[] {
  const dayStem = chart.dayHeavenlyStem as HeavenlyStem
  const dayBranch = chart.pillars.day.branch
  const monthBranch = chart.pillars.month.branch
  const strengthLevel = chart.strength.level // "신강" | "중화" | "신약"
  const { stem: yearStemIdx } = ganzhiForSolarYear(targetYear)

  const monthConfigs: {
    month: number
    branchIdx: number // 寅(2), 卯(3), 辰(4), 巳(5), 午(6), 未(7), 申(8), 酉(9), 戌(10), 亥(11), 子(0), 丑(1)
    baseSeasonKeyword: string
    solarMonthName: string
  }[] = [
    { month: 1, branchIdx: 1, baseSeasonKeyword: "새해 설계", solarMonthName: "1월" },
    { month: 2, branchIdx: 2, baseSeasonKeyword: "도약과 시작", solarMonthName: "2월" },
    { month: 3, branchIdx: 3, baseSeasonKeyword: "기회 확장", solarMonthName: "3월" },
    { month: 4, branchIdx: 4, baseSeasonKeyword: "안정과 조율", solarMonthName: "4월" },
    { month: 5, branchIdx: 5, baseSeasonKeyword: "열정과 실행", solarMonthName: "5월" },
    { month: 6, branchIdx: 6, baseSeasonKeyword: "결실 조짐", solarMonthName: "6월" },
    { month: 7, branchIdx: 7, baseSeasonKeyword: "숨고르기", solarMonthName: "7월" },
    { month: 8, branchIdx: 8, baseSeasonKeyword: "결단과 변화", solarMonthName: "8월" },
    { month: 9, branchIdx: 9, baseSeasonKeyword: "재물과 성과", solarMonthName: "9월" },
    { month: 10, branchIdx: 10, baseSeasonKeyword: "신뢰 구축", solarMonthName: "10월" },
    { month: 11, branchIdx: 11, baseSeasonKeyword: "지혜와 탐구", solarMonthName: "11월" },
    { month: 12, branchIdx: 0, baseSeasonKeyword: "유종의 미", solarMonthName: "12월" },
  ]

  const SCORE_LABELS: Record<number, string> = {
    5: "대길(大吉)",
    4: "호조(好調)",
    3: "평온(平穩)",
    2: "신중(愼重)",
    1: "수성(守成)",
  }

  return monthConfigs.map((cfg, idx) => {
    // 인월(2월)을 0번 오더로 둘 때의 연두법 계산
    const monthOrder = (idx + 11) % 12
    const mStemIdx = getMonthStemIndex(yearStemIdx, monthOrder)
    const mStem = HEAVENLY_STEMS[mStemIdx]
    const mBranch = EARTHLY_BRANCHES[cfg.branchIdx]
    const ganzhi = `${mStem}${mBranch}`

    const mStemSipsung = sipsungForStems(dayStem, mStem) as SipsungNameDto
    const mBranchSipsung = sipsungForBranchMain(dayStem, mBranch) as SipsungNameDto

    // 1. 기본 점수 기준점: 3.0점 (중립)
    let score = 3.0

    // 2. 신강 / 신약에 따른 십성 희기신 판정
    if (strengthLevel === "신강") {
      // 신강 사주: 식상/재성/관성을 반기며, 비겁/인성은 기신(에너지 과포화)
      if (["식신", "정재"].includes(mStemSipsung)) score += 1.4
      else if (["편재", "상관", "정관"].includes(mStemSipsung)) score += 0.9
      else if (mStemSipsung === "편관") score += 0.4
      else if (mStemSipsung === "비견") score -= 0.8
      else if (mStemSipsung === "겁재") score -= 1.4 // 재물 탈취, 고집 위험
      else if (["편인", "정인"].includes(mStemSipsung)) score -= 0.9
    } else if (strengthLevel === "신약") {
      // 신약 사주: 인성/비겁을 반기며, 편관(칠살)/상관/과도한 재성은 기신
      if (["정인", "편인"].includes(mStemSipsung)) score += 1.4
      else if (["비견"].includes(mStemSipsung)) score += 1.0
      else if (["겁재"].includes(mStemSipsung)) score += 0.5
      else if (["식신", "정재"].includes(mStemSipsung)) score -= 0.3
      else if (["정관"].includes(mStemSipsung)) score -= 0.6
      else if (["편재", "상관"].includes(mStemSipsung)) score -= 1.1
      else if (mStemSipsung === "편관") score -= 1.6 // 칠살의 극심한 압박
    } else {
      // 중화 사주: 4길신(식신, 정재, 정관, 정인) 우호적
      if (["식신", "정재", "정관", "정인"].includes(mStemSipsung)) score += 0.9
      else if (["편재"].includes(mStemSipsung)) score += 0.4
      else if (["비견"].includes(mStemSipsung)) score += 0.1
      else if (["상관", "편인"].includes(mStemSipsung)) score -= 0.7
      else if (["겁재", "편관"].includes(mStemSipsung)) score -= 1.2
    }

    // 3. 지지 충(沖) 및 합(合) 판정
    const hasDayChung = isChung(dayBranch, mBranch)
    const hasMonthChung = isChung(monthBranch, mBranch)
    const hasDayHap = isHap(dayBranch, mBranch)

    if (hasDayChung) {
      score -= 1.1 // 일지 충: 개인 신상, 감정 불안, 이동수, 부부/연인 마찰
    }
    if (hasMonthChung) {
      score -= 0.6 // 월지 충: 직장 및 사회 환경의 변동, 혼잡
    }
    if (hasDayHap) {
      score += 0.8 // 일지 합: 화합과 안정, 조력자 유입
    }

    // 4. 지지 십성 보정
    if (strengthLevel === "신강" && ["식신", "정재", "정관"].includes(mBranchSipsung)) score += 0.4
    if (strengthLevel === "신약" && ["정인", "비견"].includes(mBranchSipsung)) score += 0.4
    if (strengthLevel === "신약" && mBranchSipsung === "편관") score -= 0.5

    // 5. 최종 점수 정규화 (1 ~ 5)
    const finalScore = Math.max(1, Math.min(5, Math.round(score)))
    const scoreLabel = SCORE_LABELS[finalScore]

    // 6. 점수 및 기운에 따른 키워드 도출
    let keyword = cfg.baseSeasonKeyword
    if (finalScore === 5) {
      keyword = "대길의 도약"
    } else if (finalScore === 4) {
      keyword = ["정재", "편재"].includes(mStemSipsung) ? "재물 취득" : "순풍과 발전"
    } else if (finalScore === 3) {
      keyword = "내실 다지기"
    } else if (finalScore === 2) {
      keyword = hasDayChung ? "변화와 충돌 경계" : "신중한 점검"
    } else {
      keyword = "위기 관리와 수성"
    }

    // 7. 디테일 풀이 글 작성
    // (1) 종합 총평
    let summary = ""
    if (finalScore >= 4) {
      summary = `${cfg.solarMonthName}은 ${ganzhi}(천간 ${mStemSipsung}, 지지 ${mBranchSipsung})의 기운이 ${
        strengthLevel === "신강" ? "자신의 역량을 마음껏 펼칠 수 있도록 돕는" : "기운을 북돋아 든든한 조력을 제공하는"
      } 길조의 달입니다. 평소 계획했던 일을 본격적으로 실행에 옮기기에 아주 유리하며, 주도적인 자세로 임할수록 기대 이상의 결실을 맺게 됩니다.`
      if (hasDayHap) {
        summary += ` 특히 일지(${dayBranch})와 월운(${mBranch})이 육합(六合)을 이루어 대인관계가 원만해지고 뜻밖의 귀인을 만날 가능성이 큽니다.`
      }
    } else if (finalScore === 3) {
      summary = `${cfg.solarMonthName}은 ${ganzhi}(천간 ${mStemSipsung}, 지지 ${mBranchSipsung})의 기운이 감도는 평온한 달입니다. 큰 굴곡 없이 일상이 안정적으로 흘러가나, 무리한 무리수를 두기보다는 기존에 하던 일의 내실을 다지고 루틴을 점검하는 것이 유리합니다.`
    } else {
      summary = `${cfg.solarMonthName}은 ${ganzhi}(천간 ${mStemSipsung}, 지지 ${mBranchSipsung})의 영향으로 ${
        strengthLevel === "신약" && mStemSipsung === "편관"
          ? "예상치 못한 과중한 업무나 압박감이 찾아올 수 있는"
          : "주변 환경의 급격한 변동으로 신중한 처신이 요구되는"
      } 시기입니다.`
      if (hasDayChung) {
        summary += ` 특히 본인의 일지(${dayBranch})와 월운(${mBranch})이 정면으로 충(沖)을 일으키므로, 감정적인 충돌이나 섣부른 계약, 무리한 이동은 반드시 피해야 합니다.`
      } else {
        summary += ` 조급한 승부수를 던지기보다는 돌다리도 두드려 건너는 수성(守成)의 지혜가 필요합니다.`
      }
    }

    // (2) 직업 & 사업운
    let career = ""
    if (finalScore >= 4) {
      career = `${
        ["식신", "상관"].includes(mStemSipsung)
          ? "창의력과 기획력이 최고조에 달합니다. 새로운 프로젝트 론칭이나 아이디어 제안에서 동료와 상사의 찬사를 받게 됩니다."
          : ["정관", "편관"].includes(mStemSipsung)
          ? "조직 내 입지와 권한이 강화되는 승진 및 영전의 운입니다. 주저하지 말고 리더십을 발휘하세요."
          : ["정인", "편인"].includes(mStemSipsung)
          ? "시험 합격, 자격증 취득, 결재 승인에 매우 유리합니다. 전문성을 인정받아 한 단계 도약합니다."
          : "업무 효율이 극대화되며 실질적인 성과 지표가 뚜렷하게 상승합니다. 협업과 거래 성사에 길합니다."
      }`
    } else if (finalScore === 3) {
      career = "업무량과 흐름이 일정하게 유지되는 무난한 시기입니다. 파격적인 이직이나 급격한 변화보다는 현재 맡은 업무를 완벽히 숙지하고 기본기를 강화하는 것이 향후 큰 밑거름이 됩니다."
    } else {
      career = `${
        hasDayChung
          ? "직장 내 대인관계 마찰이나 업무상 이견이 생기기 쉽습니다. 상사나 거래처와의 소통에서 감정적인 대응을 삼가고 모든 업무는 문서와 기록으로 남기세요."
          : "업무 피로도가 높아지거나 추진하던 일에 일시적인 지연이 발생할 수 있습니다. 무리한 확장보다 일정 조율과 점검에 집중하세요."
      }`
    }

    // (3) 재물 & 금전운
    let wealth = ""
    if (finalScore >= 4) {
      wealth = `${
        ["정재", "편재"].includes(mStemSipsung)
          ? "금전운이 활짝 열리는 시기입니다. 고정 수입 외에 보너스, 성과급, 또는 투자 수익 등 실속 있는 목돈이 유입될 가능성이 높습니다."
          : "노력한 만큼 정당하고 풍성한 보상이 따릅니다. 장기적인 자산 증식 플랜을 실행하기에 적기입니다."
      }`
    } else if (finalScore === 3) {
      wealth = "수입과 지출이 균형을 이루는 시기입니다. 충동적인 소비만 자제한다면 안정적인 현금 흐름을 유지할 수 있으며, 가계부를 점검하고 고정 지출을 다이어트하기 좋습니다."
    } else {
      wealth = `${
        ["겁재", "상관"].includes(mStemSipsung) || hasDayChung
          ? "뜻밖의 손재수나 돌발 지출이 발생할 수 있으니 각별한 주의가 필요합니다. 동업, 지인 간의 금전 대여, 고위험 투자는 일절 피하고 현금을 지키는 방어적 운용을 하세요."
          : "지출 압박이 커질 수 있는 달입니다. 불필요한 쇼핑이나 즉흥적인 결제를 지양하고 비상금을 확보해 두세요."
      }`
    }

    // (4) 애정 & 대인관계운
    let relationship = ""
    if (finalScore >= 4) {
      relationship = `${
        hasDayHap
          ? "마음이 잘 통하는 귀인이나 새로운 인연이 다가옵니다. 부부나 연인 간에는 애정과 신뢰가 깊어지며, 솔로는 호감 가는 이성을 만날 확률이 매우 높습니다."
          : "주변 사람들이 내 편이 되어주는 따뜻한 분위기가 형성됩니다. 솔직하고 배려 깊은 대화가 행운을 부릅니다."
      }`
    } else if (finalScore === 3) {
      relationship = "가까운 지인이나 가족과의 잔잔하고 편안한 관계가 이어집니다. 특별한 이벤트보다는 일상적인 대화와 소소한 식사 자리를 통해 관계의 온도를 유지하세요."
    } else {
      relationship = `${
        hasDayChung
          ? "연인이나 배우자, 또는 오랜 친구 사이에 사소한 말 한마디로 오해나 자존심 싸움이 격화될 수 있습니다. 상대방을 이기려 들지 말고 경청과 양보의 자세를 취하세요."
          : "사람으로 인한 피로감이 생길 수 있습니다. 무리한 모임 참석을 줄이고 혼자만의 시간을 가지며 감정을 정돈하는 것이 이롭습니다."
      }`
    }

    // (5) 핵심 행동 가이드 & 주의사항
    let advice = ""
    if (finalScore >= 4) {
      advice = "✨ 실천 팁: 주저하던 결정을 내리고 적극적으로 제안하세요. 행운의 기운이 뒤를 받쳐줍니다. / ⚠️ 주의: 자만심으로 주변 동료를 소홀히 대하지 않도록 감사를 표현하세요."
    } else if (finalScore === 3) {
      advice = "✨ 실천 팁: 꾸준한 운동과 수면 패턴을 지키고, 책을 읽거나 부족한 역량을 채우세요. / ⚠️ 주의: 일상의 단조로움에 빠져 나태해지지 않도록 작은 목표를 세우세요."
    } else {
      advice = "✨ 실천 팁: 무조건 안전 위주로 행동하고, 중요한 계약이나 결정은 다음 달로 미루세요. / ⚠️ 주의: 감정적인 폭발, 과속 운전, 무리한 야근이나 과음을 철저히 경계하세요."
    }

    return {
      month: cfg.month,
      ganzhi,
      solarMonthName: cfg.solarMonthName,
      keyword,
      score: finalScore,
      scoreLabel,
      summary,
      career,
      wealth,
      relationship,
      advice,
    }
  })
}
