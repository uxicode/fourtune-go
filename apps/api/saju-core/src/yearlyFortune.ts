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

interface SipsungPairAnalysis {
  keyword: string
  interpretation: string
}

// 십성 범주 분류 헬퍼
type SipsungCategory = "식상" | "재성" | "관성" | "인성" | "비겁"
function sipsungCategory(s: SipsungNameDto): SipsungCategory {
  if (s === "식신" || s === "상관") return "식상"
  if (s === "정재" || s === "편재") return "재성"
  if (s === "정관" || s === "편관") return "관성"
  if (s === "정인" || s === "편인") return "인성"
  return "비겁"
}

/**
 * 천간 십성(stem)과 지지 십성(branch)의 조합에 따른 사주학적 해석.
 * 25가지 범주 조합(5×5)을 모두 커버하여 어떤 월에도 fallback 없이 고유한 해석을 생성합니다.
 * 각 조합 내에서도 세부 십성(정/편)에 따른 뉘앙스 차이를 반영합니다.
 */
function analyzeSipsungPair(
  stem: SipsungNameDto,
  branch: SipsungNameDto,
  _strength: string,
  score: number
): SipsungPairAnalysis {
  const stemCat = sipsungCategory(stem)
  const branchCat = sipsungCategory(branch)
  const key = `${stemCat}+${branchCat}`

  switch (key) {
    // ── 식상 + X ──
    case "식상+식상":
      return {
        keyword: score >= 4 ? "재능 폭발과 창작 전성기" : "과잉 표현 자제",
        interpretation:
          score >= 4
            ? "표현력과 아이디어가 샘솟듯 쏟아지며, 창작·기획·발표 등 자신을 드러내는 모든 영역에서 눈부신 성과를 낼 수 있는 시기입니다. 자신의 고유한 색깔을 과감히 펼쳐보세요."
            : "말과 행동이 앞서며 과장이나 실수가 생기기 쉽습니다. 아이디어를 쏟아내되, 실행에 옮기기 전 현실 가능성을 냉정하게 점검하고 불필요한 논쟁은 피하세요.",
      }
    case "식상+재성":
      return {
        keyword: score >= 4 ? "재능으로 재물을 이루는 결실" : "실속 점검 필요",
        interpretation:
          score >= 4
            ? `자신의 전문성과 실행력이 곧바로 재물 창출로 이어지는 '식상생재(食傷生財)'의 흐름입니다. ${stem === "식신" ? "꾸준히 갈고닦은 기술이 정당한 보상으로 돌아오며" : "번뜩이는 센스와 영업력으로 예상 밖의 수익을 올리며"}, 노력한 만큼 풍성한 결실을 거둡니다.`
            : "의욕은 넘치나 현실적인 시장 상황이나 자금 흐름에 신중함이 요구됩니다. 새로운 시도 전 철저한 비용 검토와 사전 조사를 거쳐야 손실을 방지합니다.",
      }
    case "식상+관성":
      return {
        keyword:
          score >= 4
            ? stem === "식신"
              ? "전문성과 공적 신뢰의 조화"
              : "창의적 혁신과 조율"
            : stem === "상관"
              ? "언행 경계와 조율"
              : "공적 역할 조율",
        interpretation:
          score >= 4
            ? stem === "식신"
              ? `자신의 고유한 재능과 역량이 조직의 안정적인 시스템과 맞물려 공적인 인정을 받는 시기입니다. ${branch === "정관" ? "성실하게 쌓아온 결과물이 조직 내 확고한 입지로 승화됩니다." : "까다로운 난관을 기지와 전문성으로 해결하며 '식신제살'의 빛나는 국면을 맞이합니다."}`
              : "기존의 불합리한 틀이나 낡은 관행을 새롭게 뒤바꾸려는 혁신의 에너지가 충만합니다. 날카로운 통찰력으로 설득력 있는 대안을 제시한다면 조직 내 판도를 유리하게 바꿀 수 있습니다."
            : stem === "상관"
              ? "기존 규율이나 윗사람과의 이견으로 긴장감이 감도는 '상관견관(傷官見官)'의 환경입니다. 옳은 말이라도 화법을 정중히 가다듬고 불필요한 마찰을 삼가야 안전합니다."
              : "조직의 엄격한 규율과 개인의 창의적 표현 사이에서 완급 조절이 필요합니다. 룰을 준수하면서 유연하게 실력을 발휘하세요.",
      }
    case "식상+인성":
      return {
        keyword: score >= 4 ? "창의와 지혜의 융합" : "재능과 학습 사이의 갈등",
        interpretation:
          score >= 4
            ? `표현 욕구와 깊이 있는 사색이 조화를 이루며, 연구 결과를 대중적으로 풀어내거나 기획을 체계적으로 정리하기에 최적인 시기입니다. ${stem === "식신" ? "차분하게 쌓은 내공이 자연스러운 결과물로 빛납니다." : "독창적인 발상에 학문적 근거를 더해 설득력 있는 작업물을 만들어내세요."}`
            : `아이디어는 많으나 마무리가 흐려지거나, 과도한 사색이 행동력을 둔화시킬 수 있습니다. ${branch === "편인" ? "'도식(倒食)' 기운으로 계획이 중도에 흐지부지되지 않도록 실행 데드라인을 철저히 관리하세요." : "생각에 갇히지 말고, 70% 완성도에서 과감히 세상에 내놓는 용기가 필요합니다."}`,
      }
    case "식상+비겁":
      return {
        keyword: score >= 4 ? "동료와 함께하는 창작 시너지" : "주도권 다툼 주의",
        interpretation:
          score >= 4
            ? `자신의 재능과 동료의 추진력이 합쳐져 강력한 창작 시너지를 발휘합니다. ${stem === "식신" ? "팀 프로젝트에서 전문 기술을 앞세워 핵심 역할을 수행하세요." : "참신한 기획을 동료들과 공유하며 함께 실행에 옮길 때 기대 이상의 성과를 냅니다."}`
            : "표현 욕구와 자기주장이 충돌하기 쉬운 환경입니다. 동료와의 아이디어 경합에서 감정적으로 부딪히지 않도록 역할 분담을 명확히 하세요.",
      }

    // ── 재성 + X ──
    case "재성+재성":
      return {
        keyword: score >= 4 ? "재물 왕성과 과감한 영역 확장" : "재정 리스크 관리",
        interpretation:
          score >= 4
            ? `재성(財星)의 기운이 천간과 지지를 가득 채우며 활동 반경과 비즈니스 기회가 대폭 확장됩니다. ${stem === "편재" ? "신규 시장 개척이나 투자에서 의외의 큰 수확이 기대됩니다." : "꾸준한 노력에 대한 안정적인 보상이 두텁게 쌓이며 자산 기반이 공고해집니다."}`
            : "자금 회전과 지출 압박이 동시에 커지는 형국입니다. 일확천금을 노리는 무리한 투자나 충동 지출을 철저히 차단하고 보수적인 자금 운용을 유지해야 합니다.",
      }
    case "재성+식상":
      return {
        keyword: score >= 4 ? "실리와 아이디어의 시너지" : "수익 구조 재점검",
        interpretation:
          score >= 4
            ? `현실적인 사업 감각과 창의적인 아이디어가 맞물려 부가가치 창출에 탁월한 역량을 발휘합니다. ${branch === "식신" ? "안정적인 기술 기반 수익 모델이 빛을 발합니다." : "남들이 보지 못하는 틈새 시장을 발굴하여 새로운 수익원을 확보할 수 있습니다."}`
            : "겉으로는 기회가 많아 보이나 내실이 부족할 수 있습니다. 매출 증대보다 비용 구조와 수익률을 꼼꼼히 점검하고 핵심 역량에 집중하세요.",
      }
    case "재성+관성":
      return {
        keyword: score >= 4 ? "성과 인정과 신임 획득" : "공적 책임 완수",
        interpretation:
          score >= 4
            ? `성실하게 일군 실질적 성과가 조직 내 신뢰와 권한 상승으로 이어지는 '재생관(財生官)'의 순풍입니다. ${branch === "정관" ? "공식적인 승진이나 직급 상승에 유리합니다." : "위기 상황에서 실적으로 입지를 증명하며 핵심 인재로 부상합니다."}`
            : "과중한 업무 책임에 비해 실속이 일시적으로 부족하게 느껴질 수 있습니다. 조급해하지 말고 공적인 원칙과 신용을 지키는 데 주력하세요.",
      }
    case "재성+인성":
      return {
        keyword: score >= 4 ? "실속과 문서 정돈" : "계약 점검과 내실",
        interpretation:
          score >= 4
            ? `현실적인 손익 계산과 계약·문서·자격 점검이 맞물리는 '재극인(財剋印)'의 시기입니다. ${stem === "정재" ? "기존 계약의 유리한 갱신이나 자산 관련 서류 정리에 최적입니다." : "새로운 거래처 발굴과 동시에 법률·세무 자문으로 리스크를 사전 차단하세요."}`
            : "명분과 실리 사이에서 갈등이 생기거나 계약 관련 분쟁이 발생하기 쉬운 달입니다. 도장을 찍기 전 조항을 면밀히 재검토하고 전문 자문을 받으세요.",
      }
    case "재성+비겁":
      return {
        keyword: score >= 4 ? "경쟁 속 실리 확보" : "손재수와 이권 분쟁 주의",
        interpretation:
          score >= 4
            ? `치열한 시장 경쟁 속에서도 비즈니스 감각과 실행력으로 핵심 이권을 차지합니다. ${stem === "편재" ? "대담한 협상력으로 유리한 딜을 성사시키세요." : "원칙에 입각한 신뢰가 경쟁자와의 차별화 포인트가 됩니다."}`
            : "이권이나 자금을 둘러싼 주변과의 마찰이 발생하기 쉬운 '군겁쟁재(群劫爭財)'의 형국입니다. 동업이나 지인 간 금전 거래를 삼가고 내 자산을 굳건히 지키세요.",
      }

    // ── 관성 + X ──
    case "관성+관성":
      return {
        keyword: score >= 4 ? "책임과 리더십 발휘" : "과중한 압박 관리",
        interpretation:
          score >= 4
            ? `공적인 권한과 책임감이 최고조에 달하는 시기입니다. ${stem === "정관" ? "중요한 임무를 도맡아 모범적인 리더십으로 신망을 얻습니다." : "결단력과 추진력이 빛나며, 위기 상황일수록 존재감을 드러냅니다."}`
            : "엄격한 규율과 주변의 과도한 기대감으로 정신적 피로가 가중됩니다. 규칙적인 휴식과 체력 관리를 최우선으로 두세요.",
      }
    case "관성+식상":
      return {
        keyword: score >= 4 ? "통솔력과 창의력의 균형" : "조직 규율 속 자기표현 관리",
        interpretation:
          score >= 4
            ? `조직의 통솔력과 개인의 창의적 역량이 시너지를 이룹니다. ${branch === "식신" ? "체계적인 시스템 안에서 전문 기술을 극대화하여 핵심 성과를 냅니다." : "혁신적인 제안으로 기존 관행을 개선하되 절차를 존중하면 큰 호응을 얻습니다."}`
            : "윗사람의 지시와 자신의 표현 욕구 사이에서 갈등이 생길 수 있습니다. 직설적인 반박보다 대안을 제시하는 건설적인 소통을 택하세요.",
      }
    case "관성+재성":
      return {
        keyword: score >= 4 ? "안정된 기반 위의 실리 추구" : "의무와 비용의 이중 압박",
        interpretation:
          score >= 4
            ? `조직적인 안정 기반 위에서 현실적인 수익을 극대화할 수 있는 흐름입니다. ${branch === "정재" ? "정당한 노력에 대한 보수가 풍성하게 돌아옵니다." : "공적 네트워크를 활용한 새로운 사업 기회가 열립니다."}`
            : "공적인 의무에 따른 지출이나 세금, 벌금 등 예기치 못한 비용 압박이 생길 수 있습니다. 미리 비상금을 확보하고 불필요한 소비를 줄이세요.",
      }
    case "관성+인성":
      return {
        keyword: score >= 4 ? "명예 상승과 귀인 조력" : "인내와 수성",
        interpretation:
          score >= 4
            ? `조직과 윗사람의 든든한 후원, 결재 승인, 합격운이 따르는 '관인상생(官印相生)'의 길조입니다. ${stem === "정관" ? "품격과 지혜를 겸비하여 주변의 전폭적인 지지 속에 명예를 드높입니다." : "위기 상황에서도 조력자의 지혜로운 조언 덕에 역전의 기회를 잡습니다."}`
            : "책임감이 무겁게 짓누르는 시기이나, 끈기 있는 인내와 조언자의 도움으로 위기를 넘길 수 있습니다. 혼자 해결하려 하지 말고 선배나 멘토와 상의하세요.",
      }
    case "관성+비겁":
      return {
        keyword: score >= 4 ? "조직 내 입지 강화" : "외부 압박과 내부 경쟁",
        interpretation:
          score >= 4
            ? `조직의 질서 안에서 동료들과 선의의 경쟁을 벌이며 자신의 입지를 확고히 다지는 시기입니다. ${stem === "정관" ? "공정한 평가 시스템 속에서 실력이 공인됩니다." : "팀 내 위기 상황에서 결단력을 보여주며 핵심 인재로 인정받습니다."}`
            : "외부의 과중한 요구와 내부 경쟁 압박이 동시에 찾아옵니다. 무리하게 남과 겨루기보다 자기 분야의 전문성을 묵묵히 증명하는 데 집중하세요.",
      }

    // ── 인성 + X ──
    case "인성+인성":
      return {
        keyword: score >= 4 ? "지식 심화와 역량 축적" : "사색 과잉 주의",
        interpretation:
          score >= 4
            ? `깊이 있는 통찰력과 학구열이 최고조에 달합니다. ${stem === "정인" ? "자격증 취득, 학위 과정, 공적 문서 처리에 매우 유리하며 조용히 쌓은 내공이 향후 무기가 됩니다." : "독창적인 연구나 전문 기술 심화에서 독보적인 결과를 만들어내세요."}`
            : "생각과 고민만 많아져 실행력이 둔화되거나 게으름에 빠지기 쉽습니다. 현실적인 실천 과제를 하나씩 매듭지어 가세요.",
      }
    case "인성+식상":
      return {
        keyword: score >= 4 ? "지혜로운 표현과 전달" : "도식(倒食) 경계와 실행력 보강",
        interpretation:
          score >= 4
            ? `축적된 지식과 통찰을 매력적으로 풀어내는 역량이 빛나는 시기입니다. ${branch === "식신" ? "전문 지식을 대중적으로 가공하여 강의, 저술, 컨설팅에서 호평을 받습니다." : "독창적인 기획안으로 기존 시장에 혁신적 관점을 제시하세요."}`
            : `사색에 치우쳐 행동이 뒤따르지 않거나 남의 의견에 과도하게 비판적이 될 수 있습니다. ${branch === "상관" ? "날선 비평보다 건설적인 대안 제시에 에너지를 쓰세요." : "계획을 줄이고 실행을 늘려 눈에 보이는 결과물을 만들어내는 데 집중하세요."}`,
      }
    case "인성+재성":
      return {
        keyword: score >= 4 ? "학습과 실리의 균형" : "문서·계약 리스크 점검",
        interpretation:
          score >= 4
            ? `전문 지식이 실질적인 수익 창출과 연결되는 흐름입니다. ${stem === "정인" ? "공적인 자격이나 면허가 안정적인 소득 기반으로 승화됩니다." : "독창적인 아이디어를 사업 모델로 전환할 적기입니다."}`
            : "문서나 계약 관련 실수가 재정적 손실로 이어질 수 있습니다. 인감과 서명이 필요한 서류는 세 번 이상 꼼꼼히 검토하고 법률 자문을 받으세요.",
      }
    case "인성+관성":
      return {
        keyword: score >= 4 ? "학문적 명예와 공적 인정" : "과중한 기대와 완벽주의 경계",
        interpretation:
          score >= 4
            ? `축적된 역량이 공적인 무대에서 인정받는 '인수관살(印綬官殺)' 상생의 흐름입니다. ${branch === "정관" ? "시험 합격, 승진, 공적 인증에 더없이 유리합니다." : "위기 상황에서 냉철한 분석력과 학문적 근거로 해결책을 제시하여 주목받습니다."}`
            : "주변의 높은 기대감과 스스로에게 부과하는 완벽주의 압박으로 스트레스가 가중됩니다. 100점이 아닌 80점의 유연함을 허락하세요.",
      }
    case "인성+비겁":
      return {
        keyword: score >= 4 ? "내면 강화와 든든한 조력" : "의존과 자립 사이의 균형",
        interpretation:
          score >= 4
            ? `지식과 경험에서 비롯된 자신감이 주체적인 행동력과 결합하여 강력한 추진력을 발휘합니다. ${stem === "정인" ? "멘토나 윗사람의 후원을 등에 업고 독립적인 발걸음을 내딛기에 최적입니다." : "남다른 통찰력으로 동료들 사이에서 참모 역할을 맡아 팀 전체의 역량을 끌어올립니다."}`
            : "남의 도움에 지나치게 의존하거나 반대로 독불장군식 고집이 생기기 쉬운 시기입니다. 배움의 겸손함과 실행의 자주성 사이에서 균형을 잡으세요.",
      }

    // ── 비겁 + X ──
    case "비겁+비겁":
      return {
        keyword: score >= 4 ? "독립과 주도성 확립" : "고집 경계와 화합",
        interpretation:
          score >= 4
            ? `자립심과 주도성이 확고해져 자신의 길을 개척하는 강인한 에너지가 솟아납니다. ${stem === "비견" ? "뜻이 맞는 조력자와 힘을 합쳐 시너지를 극대화하세요." : "선의의 라이벌을 페이스메이커 삼아 한계를 돌파하는 집중력을 발휘합니다."}`
            : "자존심과 고집이 지나쳐 주변 사람들과 대립각을 세우기 쉬운 시기입니다. 유연한 타협과 경청의 태도가 운을 지켜줍니다.",
      }
    case "비겁+식상":
      return {
        keyword: score >= 4 ? "협업 추진력과 표현 시너지" : "속도 조절과 역할 점검",
        interpretation:
          score >= 4
            ? `주체적인 열정과 동료들과의 협업 시너지가 맞물려 강력한 추진력을 내뿜는 시기입니다. ${branch === "식신" ? "팀 내에서 전문 기술을 앞세워 핵심 결과물을 만들어내세요." : "파격적인 아이디어를 동료와 공유하며 함께 구현할 때 최고의 효과를 냅니다."}`
            : "추진 의욕은 앞서나 동료와의 세부 조율이 삐걱거릴 수 있습니다. 독단적인 진행을 피하고 명확한 역할 분담을 선행하세요.",
      }
    case "비겁+재성":
      return {
        keyword: score >= 4 ? "경쟁 속 실력으로 우위 확보" : "손재수 경계와 수성",
        interpretation:
          score >= 4
            ? `치열한 경쟁 구도 속에서도 당당히 실력으로 자신의 몫을 쟁취합니다. ${branch === "정재" ? "공정한 룰 속에서 꾸준한 성과로 확실한 자리를 굳히세요." : "과감한 영업력과 승부욕이 새로운 거래 성사로 직결됩니다."}`
            : "이권이나 돈을 둘러싸고 주변과의 갈등이나 손재수가 발생하기 쉬운 '군겁쟁재(群劫爭財)'의 환경입니다. 동업이나 지인 간 금전 거래는 일절 삼가고 내실을 지키세요.",
      }
    case "비겁+관성":
      return {
        keyword: score >= 4 ? "역경 돌파와 자기 증명" : "외압과 내부 마찰 주의",
        interpretation:
          score >= 4
            ? `외부의 도전과 시련을 불굴의 의지로 돌파하며 성장하는 시기입니다. ${branch === "정관" ? "공적인 규율과 체계를 존중하면서 주도적으로 임할 때 빛을 발합니다." : "위기를 정면 돌파하는 대담한 결단력이 오히려 더 큰 성과로 이어집니다."}`
            : "외부의 과도한 통제와 자신의 자존심이 정면으로 부딪히기 쉽습니다. 굳이 맞서 싸우기보다 전략적 후퇴와 내실 다지기로 때를 기다리세요.",
      }
    case "비겁+인성":
      return {
        keyword: score >= 4 ? "자기 확신과 배움의 성장" : "수동적 의존 탈피",
        interpretation:
          score >= 4
            ? `주체적인 행동력에 지혜로운 학습이 더해져 단단한 내면과 실력을 동시에 갖추는 시기입니다. ${branch === "정인" ? "멘토의 조언을 적극 수용하면서 독립적인 판단력을 기르세요." : "독학이나 자격 취득에서 남다른 집중력을 발휘하여 전문성을 공인받습니다."}`
            : "주변의 도움에 지나치게 기대거나 수동적인 태도에 빠지기 쉽습니다. 스스로 결정하고 실행하는 자립의 힘을 키우는 것이 급선무입니다.",
      }
  }

  // 이론상 도달 불가 (25가지 모두 커버)
  return {
    keyword: "일상 균형",
    interpretation: "일상의 균형을 유지하며 꾸준한 전진을 이어가기에 무난한 흐름입니다.",
  }
}

/**
 * 월별 직업 & 사업운 (천간·지지 십성 조합 + 점수 기반 세분화)
 */
function getMonthlyCareerLuck(
  stem: SipsungNameDto,
  branch: SipsungNameDto,
  score: number,
  hasChung: boolean
): string {
  const stemCat = sipsungCategory(stem)
  const branchCat = sipsungCategory(branch)

  if (score >= 4) {
    if (stemCat === "식상") {
      if (branchCat === "관성") return stem === "식신" ? "전문 기술과 노하우를 조직의 공적 시스템에 녹여내어 확고한 입지를 구축합니다. 결과물의 완성도가 곧 신뢰로 이어집니다." : "기존 프로세스의 비효율을 날카롭게 포착하고 설득력 있는 개선안으로 팀의 판도를 바꿉니다."
      if (branchCat === "재성") return "창의적인 기획이 곧바로 매출 증가나 거래 성사로 이어집니다. 아이디어를 실행으로 빠르게 옮길수록 결실이 풍성합니다."
      if (branchCat === "인성") return "축적된 지식을 바탕으로 한 기획안이나 보고서가 상사와 고객에게 높은 평가를 받습니다."
      if (branchCat === "비겁") return "동료와 역할을 효과적으로 분담하여 강력한 팀워크로 목표를 초과 달성합니다."
      return stem === "식신" ? "전문 기술과 노하우가 완벽히 발휘되며 새로운 결과물을 릴리즈하기에 최적의 타이밍입니다." : "창의적인 기획과 프레젠테이션에서 발군의 역량을 드러내며 팀 내 찬사를 이끌어냅니다."
    }
    if (stemCat === "재성") {
      if (branchCat === "관성") return "영업 성과가 조직 내 공식적인 인정과 직결됩니다. 거래 성사 건수가 승진이나 인센티브로 돌아올 수 있습니다."
      if (branchCat === "인성") return "계약서 점검과 자산 관련 문서 처리에서 꼼꼼함이 빛을 발합니다. 유리한 조건의 딜을 매듭짓기에 아주 좋습니다."
      if (branchCat === "식상") return "사업 감각과 기획력이 조화를 이루어 신규 프로젝트 론칭이나 시장 개척에 강한 추진력을 발휘합니다."
      if (branchCat === "비겁") return "치열한 경쟁 속에서 비즈니스 감각과 신속한 판단력으로 유리한 포지션을 선점합니다."
      return stem === "편재" ? "새로운 거래처 발굴이나 시장 트렌드 포착에서 남다른 안목을 발휘합니다." : "실질적인 실적 지표가 가파르게 상승합니다. 거래처와의 협상에서 유리한 조건을 확보합니다."
    }
    if (stemCat === "관성") {
      if (branchCat === "인성") return "윗사람의 전폭적인 지지와 결재 승인이 따릅니다. 공적 자격이나 직급 상승에 가장 유리한 시기입니다."
      if (branchCat === "재성") return "조직의 자원을 효율적으로 배분하고 관리하는 역량이 돋보입니다. 예산 관리와 성과 극대화를 동시에 이뤄냅니다."
      if (branchCat === "식상") return "체계적인 리더십과 팀원의 창의력이 결합되어 돌파구를 찾습니다. 결정권자로서의 결단이 빛을 발합니다."
      if (branchCat === "비겁") return "조직 내 경쟁에서 실력으로 우위를 점합니다. 공정한 평가 시스템이 당신의 편입니다."
      return stem === "정관" ? "리더십과 모범적인 태도로 조직 내 신망이 높아지며 승진이나 영전의 운이 따릅니다." : "위기 상황에서 결단력을 발휘하여 핵심 인재로 부상합니다."
    }
    if (stemCat === "인성") {
      if (branchCat === "관성") return "시험 합격, 자격증 취득, 기안 승인에 더없이 유리합니다. 쌓아온 전문성이 공적으로 인정받아 입지가 단단해집니다."
      if (branchCat === "식상") return "연구 결과나 기획안을 효과적으로 발표하여 조직 내 참모 역할로 주목받습니다."
      if (branchCat === "재성") return "전문 지식을 활용한 컨설팅, 강의, 자문 등에서 실질적인 성과와 보수가 따릅니다."
      if (branchCat === "비겁") return "학습과 실무 경험의 결합으로 빠르게 성장합니다. 자기 계발 투자가 커리어 도약으로 직결됩니다."
      return stem === "정인" ? "선배나 윗사람의 추천과 후원이 커리어 전환의 발판이 됩니다." : "독창적인 시각과 전문적 역량으로 차별화된 결과물을 만들어냅니다."
    }
    // 비겁
    if (branchCat === "식상") return "동료들과의 협업 속에서 각자의 전문 역할을 분담하여 시너지를 극대화합니다."
    if (branchCat === "관성") return "조직의 기대에 부응하며 경쟁자를 실력으로 압도합니다."
    if (branchCat === "인성") return "학습과 실무 경험의 결합으로 빠르게 성장합니다. 자기 계발이 도약으로 이어집니다."
    if (branchCat === "재성") return "치열한 경쟁 속에서 뚝심과 추진력으로 기회를 선점합니다."
    return "동료들과의 원활한 공조로 목표를 초과 달성합니다. 주도적으로 업무를 이끌어가세요."
  }

  if (score === 3) {
    if (stemCat === "식상") return "기획과 창작 활동이 무난하게 진행됩니다. 완성도를 높이기 위한 수정·보완 작업에 집중하면 다음 달에 빛을 발할 기반이 됩니다."
    if (stemCat === "재성") return "거래와 영업 흐름이 안정적으로 유지됩니다. 무리한 확장보다는 기존 고객 관리와 내부 프로세스 개선에 초점을 맞추세요."
    if (stemCat === "관성") return "조직 내 역할과 책임이 일정하게 유지되는 시기입니다. 급격한 변화보다는 현재 맡은 업무를 꼼꼼히 마무리하세요."
    if (stemCat === "인성") return "학습과 자기 계발에 투자하기 좋은 때입니다. 당장의 성과보다 장기적인 역량 축적에 무게를 두세요."
    return "업무 흐름이 예측 가능한 범위 내에서 유지됩니다. 기본기를 점검하고 프로세스를 표준화하는 것이 유리합니다."
  }

  if (hasChung) return "업무상 이견이나 대인관계 마찰이 발생하기 쉽습니다. 즉흥적인 감정 표출을 억제하고 모든 커뮤니케이션을 메일과 문서로 철저히 기록하세요."
  if (stemCat === "관성") return "과중한 업무와 기대감에 짓눌려 번아웃 위험이 있습니다. 무리한 야근을 줄이고 우선순위를 명확히 재설정하세요."
  if (stemCat === "비겁" && branchCat === "관성") return "외부의 통제와 내면의 자존심이 충돌하는 시기입니다. 전략적 유연함으로 불필요한 충돌을 피하세요."
  if (stemCat === "식상" && branchCat === "관성") return "창의적인 제안이 조직의 보수적인 문화와 부딪힐 수 있습니다. 시기를 기다리며 내실을 다지세요."
  return "업무 피로도가 가중되거나 일정 지연이 일어날 수 있습니다. 일의 우선순위를 재배치하고 불필요한 과업을 과감히 덜어내세요."
}

/**
 * 월별 재물 & 금전운
 */
function getMonthlyWealthLuck(
  stem: SipsungNameDto,
  branch: SipsungNameDto,
  score: number,
  hasChung: boolean
): string {
  const stemCat = sipsungCategory(stem)
  const branchCat = sipsungCategory(branch)

  if (score >= 4) {
    if (stemCat === "재성" && branchCat === "재성") return "재성이 천간·지지를 가득 채워 현금 유동성이 풍부한 달입니다. 수입원이 다각화되며 목돈 마련에 유리합니다."
    if (stemCat === "식상" && branchCat === "재성") return "자신의 재능이 직접적인 수익으로 환원되는 '식상생재'의 흐름입니다. 부업이나 창작 활동에서 쏠쏠한 소득이 기대됩니다."
    if (stemCat === "재성" && branchCat === "식상") return "사업 감각과 아이디어의 결합으로 신규 수익 모델이 가시화됩니다. 고부가가치 전환을 모색하세요."
    if (stemCat === "재성" && branchCat === "관성") return "정당한 노력에 대한 공적 보상(연봉 인상, 인센티브, 보너스)이 풍성하게 따릅니다."
    if (stemCat === "재성" && branchCat === "인성") return "계약 갱신, 부동산 거래, 지적 재산 관련 서류에서 유리한 조건을 확보합니다."
    if (stemCat === "인성") return "부동산, 계약, 자격증 등 문서와 관련된 자산 증식에 길운이 따릅니다. 장기적 관점의 안전 자산 투자가 유리합니다."
    if (stem === "정재") return "정기적이고 안정적인 소득 기반이 공고해집니다. 장기 저축이나 우량 자산 매입을 실행하기에 최적입니다."
    if (stem === "편재") return "현금 흐름이 매우 활발해지는 시기입니다. 투자 수익이나 의외의 목돈 유입 가능성이 높습니다."
    if (stemCat === "관성") return "공적인 직위 상승에 따른 정당한 보수 증가가 기대됩니다. 보수적인 포트폴리오 유지가 길합니다."
    return "노력한 만큼 정당하고 풍성한 보상이 뒤따릅니다. 재정적 여유를 바탕으로 건전한 포트폴리오를 구축하세요."
  }

  if (score === 3) {
    if (stemCat === "재성") return "수입과 지출이 안정적으로 균형을 이룹니다. 새로운 투자보다는 기존 자산을 점검하고 고정 비용을 최적화하는 것이 유리합니다."
    if (stemCat === "인성") return "학습이나 자격 투자에 소요되는 비용이 있으나 장기적으로 큰 수확으로 돌아올 씨앗 지출입니다."
    if (stemCat === "관성") return "정해진 틀 안에서 안정적인 소득 흐름이 유지됩니다. 충동적 소비만 자제하면 무난히 저축을 늘릴 수 있습니다."
    return "수입과 지출이 평형을 이루는 무난한 흐름입니다. 고정 지출 절감과 비상금 확보에 집중하세요."
  }

  if (hasChung || stem === "겁재") return "돌발 지출이나 손재수가 발생하기 쉽습니다. 고위험 투자, 지인과의 금전 대여, 충동구매는 철저히 배제하고 현금을 안전하게 보전하세요."
  if (stemCat === "비겁" && branchCat === "재성") return "이권 다툼으로 인한 예상치 못한 금전 손실에 주의하세요. 공동 투자나 동업은 반드시 피하고 자기 자산을 지키세요."
  if (stemCat === "관성") return "세금, 벌금, 수리비 등 의무적 지출이 발생할 수 있습니다. 비상금을 넉넉히 확보하고 불필요한 소비를 줄이세요."
  return "예상치 못한 공과금이나 유지 보수비 등 지출 압박이 생길 수 있습니다. 결제 전 필요성을 재검토하고 허리띠를 졸라매세요."
}

/**
 * 월별 애정 & 대인관계운
 */
function getMonthlyRelationshipLuck(
  stem: SipsungNameDto,
  branch: SipsungNameDto,
  score: number,
  hasHap: boolean,
  hasChung: boolean
): string {
  const stemCat = sipsungCategory(stem)
  const branchCat = sipsungCategory(branch)

  if (score >= 4) {
    if (hasHap) return "육합(六合)의 조력으로 귀인이 나타나고 애정 전선에 훈풍이 붑니다. 커플은 신뢰가 한층 깊어지며, 솔로는 매력적인 인연을 만납니다."
    if (stemCat === "재성" && branchCat === "관성") return "사회적으로 안정된 파트너와의 관계가 깊어집니다. 공적인 자리에서 의미 있는 인연을 맺을 확률이 높습니다."
    if (stemCat === "관성" && branchCat === "인성") return "서로의 성장을 응원하는 지적인 교류가 관계에 깊이를 더합니다. 진지한 대화가 유대감을 강화합니다."
    if (stemCat === "식상") return "솔직하고 유쾌한 대화로 주변 사람들에게 호감을 삽니다. 표현력이 빛나며 모임에서 분위기 메이커 역할을 합니다."
    if (stem === "정관" || stem === "정재") return "예의 바르고 신뢰할 수 있는 인간관계가 형성됩니다. 진지한 만남이나 결혼 등 미래를 약속하기에 좋습니다."
    if (stemCat === "인성") return "마음이 통하는 깊이 있는 대화가 가능한 인연이 다가옵니다. 지적 교감이 관계의 핵심 축이 됩니다."
    return "주변 사람들이 내 편이 되어주고 온화한 분위기가 조성됩니다. 소중한 사람들과의 교류를 통해 깊은 위안을 얻습니다."
  }

  if (score === 3) {
    if (stemCat === "식상") return "편안하고 유쾌한 만남이 이어집니다. 소규모의 진솔한 대화 자리가 관계에 활력을 줍니다."
    if (stemCat === "관성") return "의례적이지만 안정적인 관계가 유지됩니다. 예의 있는 소통으로 기존 관계의 온도를 지키세요."
    if (stemCat === "인성") return "조용하고 내면적인 교류가 돋보입니다. 공통 관심사를 나누며 유대감을 쌓아가기 좋습니다."
    return "잔잔하고 편안한 관계가 이어집니다. 소소한 식사나 일상 대화를 나누며 유대감을 유지하세요."
  }

  if (hasChung) return "사소한 말실수나 자존심 싸움으로 오랜 인연이나 연인과 마찰을 빚기 쉽습니다. 맞서 이기려 들지 말고 경청과 양보를 실천하세요."
  if (stemCat === "비겁" && branchCat === "재성") return "이성 관계에서 경쟁 심리나 질투로 인한 갈등이 생길 수 있습니다. 상대방을 존중하는 자세를 유지하세요."
  if (stemCat === "관성") return "관계에서 통제욕이나 부담감이 커질 수 있습니다. 상대방에게 과도한 기대를 내려놓고 서로의 공간을 존중하세요."
  return "사람으로 인한 감정 소모가 커질 수 있는 시기입니다. 불필요한 모임 참석을 줄이고 혼자만의 재충전 시간을 가지세요."
}

/**
 * 월별 핵심 행동 가이드 & 주의사항 (천간·지지 십성 조합 기반)
 */
function getMonthlyAdvice(
  stem: SipsungNameDto,
  branch: SipsungNameDto,
  score: number,
  hasChung: boolean
): string {
  const stemCat = sipsungCategory(stem)
  const branchCat = sipsungCategory(branch)

  const luckyByPair: Record<string, string> = {
    "식상+식상": "아이디어를 종이 위에 정리하고, 하나를 골라 즉시 실행에 옮기세요. 다작(多作)이 경쟁력입니다.",
    "식상+재성": "자신의 재능을 수익화할 구체적인 계획을 세우세요. 부업이나 사이드 프로젝트 론칭에 최적기입니다.",
    "식상+관성": stem === "식신" ? "전문 기술을 공적인 결과물로 정리하여 포트폴리오에 추가하세요." : "혁신적인 아이디어를 정중한 화법으로 포장하여 결정권자에게 제안하세요.",
    "식상+인성": "깊이 있는 독서나 학습으로 영감을 충전하고, 배운 것을 즉시 실전에 적용해보세요.",
    "식상+비겁": "동료와 역할을 명확히 나누고 각자의 강점을 살려 협업 프로젝트를 추진하세요.",
    "재성+재성": "분산 투자와 리스크 관리를 점검하세요. 전체 자산의 20% 이상을 한곳에 집중하지 마세요.",
    "재성+식상": "사업 아이디어를 가시적인 프로토타입으로 만들어 시장 반응을 테스트하세요.",
    "재성+관성": "공적인 실적 보고서를 꼼꼼히 작성하여 윗선에 어필하세요. 숫자가 말하게 하세요.",
    "재성+인성": "계약서와 자산 관련 서류를 체계적으로 정리하고 법률 자문을 받으세요.",
    "재성+비겁": "공동 투자를 피하고 단독으로 의사결정하세요. 지인과의 금전 거래는 문서로 명확히 남기세요.",
    "관성+관성": "업무 우선순위를 명확히 세우고 위임할 수 있는 일은 과감히 맡기세요. 체력 관리가 성과의 열쇠입니다.",
    "관성+식상": "규율과 창의 사이에서 균형을 찾으세요. 절차를 존중하면서 개선안을 정중히 제시하세요.",
    "관성+재성": "예산 집행과 비용 관리를 꼼꼼히 점검하세요. 효율적 자원 배분이 곧 리더십의 증명입니다.",
    "관성+인성": "윗사람이나 멘토에게 적극적으로 조언을 구하세요. 그들의 경험이 시행착오를 줄여줍니다.",
    "관성+비겁": "팀 내 경쟁보다 협력적 목표 설정에 집중하세요. 같은 편을 만드는 것이 가장 강력한 전략입니다.",
    "인성+인성": "자격증 공부나 전문 서적 독파에 집중하세요. 조용히 쌓은 내공이 다음 기회를 열어줍니다.",
    "인성+식상": "배운 것을 블로그, 강의, 세미나 등으로 표현하여 공유하세요. 가르치면서 배움이 완성됩니다.",
    "인성+재성": "전문 지식을 활용한 수익화 방안을 구체적으로 모색하세요. 컨설팅이나 자문 기회를 놓치지 마세요.",
    "인성+관성": "공적 시험이나 자격 도전에 과감히 도전하세요. 합격운이 강하게 따르는 시기입니다.",
    "인성+비겁": "혼자만의 학습에서 벗어나 스터디그룹이나 커뮤니티에 참여하세요. 함께 배우면 더 멀리 갑니다.",
    "비겁+비겁": "자신만의 목표에 집중하고, 파트너와는 명확한 원칙 위에서 신뢰를 쌓으세요.",
    "비겁+식상": "주도적으로 프로젝트를 발의하되, 실행 과정에서는 팀원의 의견을 충분히 수렴하세요.",
    "비겁+재성": "재물에 대한 욕심을 절제하고 장기적 관점에서 자산을 보전하세요. 수성(守成)이 최선입니다.",
    "비겁+관성": "외부의 규율에 저항하기보다 전략적으로 순응하며 내실을 다지세요. 때를 기다리는 지혜가 필요합니다.",
    "비겁+인성": "자기 계발에 투자하면서도 스스로 결정하고 행동하는 자립의 힘을 키우세요.",
  }

  const cautionByPair: Record<string, string> = {
    "식상+식상": "과도한 말과 표현이 오해를 부르거나 에너지를 분산시킬 수 있습니다. '한 가지에 집중'을 모토로 삼으세요.",
    "식상+재성": "수익에 눈이 멀어 품질을 타협하거나 과도한 확장에 나서지 않도록 주의하세요.",
    "식상+관성": stem === "상관" ? "윗사람이나 규율에 대한 직설적 비판이 자존심 싸움으로 번지지 않도록 화법을 가다듬으세요." : "조직의 기대에 부응하느라 자신의 창의성을 억누르지 마세요.",
    "식상+인성": "생각만 앞서고 실행이 뒤따르지 않는 관성에 빠지지 마세요. 70% 완성도에서 과감히 시작하세요.",
    "식상+비겁": "아이디어 주도권을 놓고 동료와 감정 충돌이 일어나지 않도록 소통과 양보를 선행하세요.",
    "재성+재성": "과욕으로 벌려놓은 일의 수습이 어려워질 수 있습니다. 리스크 분산과 현금 보유 비중을 높이세요.",
    "재성+식상": "아이디어에 취해 현실 검증 없이 자금을 투입하지 마세요. 데이터와 숫자로 판단하세요.",
    "재성+관성": "공과 사를 명확히 구분하세요. 공적 자금이나 조직 자원의 사적 사용은 절대 금물입니다.",
    "재성+인성": "계약서의 작은 글씨까지 꼼꼼히 읽으세요. 서명 전 전문가 검토가 큰 손실을 방지합니다.",
    "재성+비겁": "지인과의 금전 대여나 동업을 절대 피하세요. 돈 문제로 소중한 인연을 잃지 마세요.",
    "관성+관성": "과도한 책임감과 스트레스로 번아웃이 오지 않도록 의식적으로 휴식을 챙기세요.",
    "관성+식상": "상사의 방침에 정면으로 반기를 들기보다 대안을 준비하여 건설적으로 소통하세요.",
    "관성+재성": "공적 의무에 따른 지출을 미리 예산에 반영하세요. 갑작스러운 자금 부담에 대비하세요.",
    "관성+인성": "완벽주의에 빠져 결정을 끝없이 미루지 마세요. 적시적소의 실행이 완벽한 계획보다 낫습니다.",
    "관성+비겁": "조직 내 경쟁에서 감정적으로 대응하지 말고 냉철하게 성과로 말하세요.",
    "인성+인성": "과도한 사색이나 걱정에 빠져 행동이 멈추지 않도록 일일 실천 목록을 작성하세요.",
    "인성+식상": branch === "상관" ? "날선 비평이 관계를 해칠 수 있습니다. 비판보다 대안 제시에 에너지를 쓰세요." : "지식의 전달에서 독선적이 되지 않도록 상대방의 눈높이를 배려하세요.",
    "인성+재성": "학문과 이익 사이에서 원칙을 훼손하지 마세요. 단기 수익보다 장기 신뢰가 더 큰 자산입니다.",
    "인성+관성": "높은 기대감에 스스로를 옥죄지 마세요. 실패해도 다시 도전할 수 있는 여유를 유지하세요.",
    "인성+비겁": "남의 도움에만 기대는 수동적 태도를 경계하세요. 배움을 실천으로 연결하는 자립 의지가 필요합니다.",
    "비겁+비겁": "자존심 싸움이나 독단적인 고집으로 가까운 사람과 불필요한 갈등을 일으키지 마세요.",
    "비겁+식상": "독단적 판단으로 일을 추진하다 팀과의 호흡이 어긋나지 않도록 소통을 게을리하지 마세요.",
    "비겁+재성": "돈에 대한 집착이 인간관계를 해칠 수 있습니다. 물질보다 신뢰를 우선하세요.",
    "비겁+관성": "외부 압박에 감정적으로 반발하지 말고 전략적 유연함으로 상황을 관리하세요.",
    "비겁+인성": "주변의 조언을 무시하고 독불장군식으로 행동하지 마세요. 겸손한 수용이 더 빠른 성장의 길입니다.",
  }

  const pairKey = `${stemCat}+${branchCat}`
  const lucky = luckyByPair[pairKey] || "규칙적인 일상을 유지하며 작은 목표부터 차근차근 이뤄가세요."
  let caution = cautionByPair[pairKey] || "무리한 확장이나 충동적인 결정을 피하고 안전 위주로 행동하세요."

  if (hasChung) {
    caution = `일지 충(沖)의 영향으로 감정 조절과 안전사고, 섣부른 계약을 각별히 경계하세요. (${caution})`
  }

  return `✨ 실천 팁: ${lucky} / ⚠️ 주의: ${caution}`
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
      if (["식신", "정재"].includes(mStemSipsung)) score += 1.4
      else if (["편재", "상관", "정관"].includes(mStemSipsung)) score += 0.9
      else if (mStemSipsung === "편관") score += 0.4
      else if (mStemSipsung === "비견") score -= 0.8
      else if (mStemSipsung === "겁재") score -= 1.4
      else if (["편인", "정인"].includes(mStemSipsung)) score -= 0.9
    } else if (strengthLevel === "신약") {
      if (["정인", "편인"].includes(mStemSipsung)) score += 1.4
      else if (["비견"].includes(mStemSipsung)) score += 1.0
      else if (["겁재"].includes(mStemSipsung)) score += 0.5
      else if (["식신", "정재"].includes(mStemSipsung)) score -= 0.3
      else if (["정관"].includes(mStemSipsung)) score -= 0.6
      else if (["편재", "상관"].includes(mStemSipsung)) score -= 1.1
      else if (mStemSipsung === "편관") score -= 1.6
    } else {
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

    if (hasDayChung) score -= 1.1
    if (hasMonthChung) score -= 0.6
    if (hasDayHap) score += 0.8

    // 4. 지지 십성 보정
    if (strengthLevel === "신강" && ["식신", "정재", "정관"].includes(mBranchSipsung)) score += 0.4
    if (strengthLevel === "신약" && ["정인", "비견"].includes(mBranchSipsung)) score += 0.4
    if (strengthLevel === "신약" && mBranchSipsung === "편관") score -= 0.5

    // 5. 최종 점수 정규화 (1 ~ 5)
    const finalScore = Math.max(1, Math.min(5, Math.round(score)))
    const scoreLabel = SCORE_LABELS[finalScore]

    // 6. 사주학적 십성 조합(천간 + 지지 상호작용) 테마 분석
    const pairAnalysis = analyzeSipsungPair(mStemSipsung, mBranchSipsung, strengthLevel, finalScore)

    // 점수와 십성 조합을 반영한 다채로운 키워드 도출
    const keyword = pairAnalysis.keyword

    // 7. 디테일 풀이 글 작성
    // (1) 종합 총평 (반복 템플릿 배제, 십성 조합과 길흉에 기반한 유니크한 문장 생성)
    let summary = `${cfg.solarMonthName}은 ${ganzhi}(천간 ${mStemSipsung}, 지지 ${mBranchSipsung})의 기운이 주도하는 시기로, ${pairAnalysis.interpretation}`
    if (hasDayHap) {
      summary += ` 특히 일지(${dayBranch})와 월운(${mBranch})이 육합(六合)을 이루어 대인관계가 돈독해지고 뜻밖의 귀인이나 협력자가 나타나 든든한 힘이 됩니다.`
    }
    if (hasDayChung) {
      summary += ` 다만 본인의 일지(${dayBranch})와 월운(${mBranch})이 충(沖)을 일으키므로 감정적인 대립이나 섣부른 계약, 무리한 이동은 각별히 삼가야 합니다.`
    } else if (hasMonthChung) {
      summary += ` 한편 월지(${monthBranch})와의 충(沖) 영향으로 직장 환경이나 사회적 역할에 일시적인 변동이나 어수선함이 따를 수 있으니 유연한 대처가 요구됩니다.`
    }

    // (2) 직업 & 사업운 (천간/지지 십성 및 점수 기반 세분화)
    const career = getMonthlyCareerLuck(mStemSipsung, mBranchSipsung, finalScore, hasDayChung)

    // (3) 재물 & 금전운
    const wealth = getMonthlyWealthLuck(mStemSipsung, mBranchSipsung, finalScore, hasDayChung)

    // (4) 애정 & 대인관계운
    const relationship = getMonthlyRelationshipLuck(mStemSipsung, mBranchSipsung, finalScore, hasDayHap, hasDayChung)

    // (5) 핵심 행동 가이드 & 주의사항 (십성 조합별 특화 팁)
    const advice = getMonthlyAdvice(mStemSipsung, mBranchSipsung, finalScore, hasDayChung)

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

