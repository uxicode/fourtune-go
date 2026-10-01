import type {
  EasyInterpretationDto,
  FiveElement,
  PillarDto,
  SajuChartDto,
  SipsungNameDto,
} from "./types.js"

interface DayMasterMeta {
  symbol: string
  title: string
  personality: string
}

const DAY_MASTER_INFO: Record<string, DayMasterMeta> = {
  갑: {
    symbol: "푸른 거목(큰 나무)",
    title: "당당한 기개와 리더십의 개척가",
    personality:
      "뿌리가 깊고 곧게 뻗은 거목처럼, 당당한 자존감과 높은 이상을 품고 있습니다. 매사 솔선수범하여 앞장서기를 좋아하며 불의를 보면 참지 못하는 정의감이 돋보입니다. 굽히기보다는 부러지는 우직함이 있어 때로는 유연한 대처가 행운을 부릅니다.",
  },
  을: {
    symbol: "생명력 넘치는 화초와 덩굴",
    title: "유연한 적응력과 외유내강의 실속파",
    personality:
      "바위틈에서도 싹을 틔우는 화초처럼, 겉은 부드럽고 다정하지만 속은 어떤 시련에도 꺾이지 않는 강인한 생명력을 품고 있습니다. 대인관계에서 뛰어난 친화력과 순발력을 발휘하며, 현실적인 실속을 챙기는 능력이 뛰어납니다.",
  },
  병: {
    symbol: "온 세상을 비추는 찬란한 태양",
    title: "열정적이고 솔직담백한 에너지의 리더",
    personality:
      "어둠을 밝히는 태양처럼 매사 밝고 긍정적인 에너지를 뿜어냅니다. 솔직하고 뒤끝이 없으며, 사람들을 품고 이끄는 호쾌한 성격입니다. 열정이 넘치는 만큼 시작은 화려하나 마무리에 집중할 때 더 큰 결실을 맺습니다.",
  },
  정: {
    symbol: "어둠을 밝히는 따스한 촛불/등불",
    title: "섬세한 감수성과 깊은 통찰력의 힐러",
    personality:
      "은은하게 주위를 밝히는 촛불처럼, 타인을 배려하는 섬세한 마음씨와 예리한 직관력을 지녔습니다. 평소엔 온화하고 조용하지만 내면에 남모르는 뜨거운 열정과 집중력을 품고 있습니다. 감정의 서운함을 제때 표현하면 운이 더욱 트입니다.",
  },
  무: {
    symbol: "듬직하고 웅장한 대지/큰 산",
    title: "믿음직한 포용력과 묵직한 중심추",
    personality:
      "누구나 기댈 수 있는 큰 산처럼, 과묵하면서도 포용력이 깊어 사람들에게 두터운 신뢰를 줍니다. 웬만한 일에는 쉽게 흔들리지 않는 뚝심과 중재 능력이 돋보입니다. 고집을 조금 내려놓고 변화를 수용할 때 큰 기회를 잡습니다.",
  },
  기: {
    symbol: "만물을 길러내는 비옥한 흙/정원",
    title: "성실하고 다정한 현실주의자",
    personality:
      "농작물을 정성껏 키워내는 논밭처럼, 온화하고 다정하며 디테일을 놓치지 않는 성실함을 지녔습니다. 현실 감각이 매우 뛰어나 주변을 알뜰하게 보살피며 실질적인 성과를 만들어냅니다. 스스로를 위한 휴식과 자기주장을 챙기면 더욱 행복해집니다.",
  },
  경: {
    symbol: "단단한 바위와 강철/원석",
    title: "의리와 결단력을 품은 승부사",
    personality:
      "불필요한 것을 한칼에 베어내는 강철처럼, 맺고 끊음이 분명하고 공정함을 중시합니다. 의리가 두텁고 위기 상황에서 탁월한 결단력과 추진력을 발휘합니다. 솔직하고 거침없는 화법을 조금만 부드럽게 가다듬으면 대인관계가 탄탄해집니다.",
  },
  신: {
    symbol: "정밀하게 다듬어진 보석/세공칼",
    title: "예리한 직관과 완벽을 추구하는 장인",
    personality:
      "자체로 영롱하게 빛나는 보석처럼, 깔끔한 미적 감각과 높은 자존감, 예리한 분석력을 갖추고 있습니다. 매사 완벽을 추구하며 자신만의 원칙과 품격을 지켜냅니다. 스스로에게 지나치게 엄격해지지 않도록 여유를 가지는 것이 좋습니다.",
  },
  임: {
    symbol: "넓고 깊은 바다/큰 강물",
    title: "지혜와 통찰을 품은 자유로운 전략가",
    personality:
      "세상 모든 물을 품어 안는 바다처럼, 스케일이 크고 상황에 맞춰 변화무쌍하게 흐르는 유연한 지혜를 지녔습니다. 깊은 사색과 창의적인 기획력이 뛰어나며 자유로운 환경에서 잠재력이 폭발합니다. 한곳에 집중하는 끈기를 더하면 대성합니다.",
  },
  계: {
    symbol: "생명을 적시는 단비/맑은 샘물",
    title: "총명한 센스와 순발력을 갖춘 전략가",
    personality:
      "대지를 부드럽게 적시는 봄비처럼, 눈치가 빠르고 센스가 넘치며 학습 능력이 탁월합니다. 조용히 주변을 살피며 적재적소에 필요한 도움을 주는 스마트한 면모가 있습니다. 사소한 일에 대한 걱정을 내려놓고 실행력을 높이면 승승장구합니다.",
  },
}

const INNER_MIND_BY_SIPSUNG: Record<SipsungNameDto, string> = {
  편관: "내면에는 스스로에 대한 높은 기준과 책임감이 자리 잡고 있습니다. 위기를 기회로 바꾸는 긴장감과 승부욕을 원동력으로 삼아 남다른 성과를 이끌어냅니다.",
  정관: "원칙과 품위, 신뢰를 최우선으로 생각합니다. 공정하고 체계적인 환경에서 자신의 능력을 온전히 발휘하며 사람들에게 모범이 됩니다.",
  편재: "기회를 포착하는 감각이 남다르고 호기심과 활동 반경이 넓습니다. 고정된 틀에 머물기보다 새로운 영역을 개척하며 활력을 얻습니다.",
  정재: "안정과 신뢰, 꾸준한 루틴을 소중히 여깁니다. 꼼꼼한 관리 능력과 성실함으로 차근차근 탄탄한 기반을 일구어 나가는 강점이 있습니다.",
  식신: "자신만의 재능과 표현, 편안한 여유를 지향합니다. 낙천적이면서도 좋아하는 분야에는 깊이 몰입하여 전문가적인 결실을 맺습니다.",
  상관: "기존의 규칙에 얽매이지 않는 자유로운 창의력과 번뜩이는 직관이 내면에 가득합니다. 뛰어난 표현력으로 세상을 놀라게 하는 힘이 있습니다.",
  편인: "독창적인 시각과 깊이 있는 사색을 즐깁니다. 남들이 보지 못하는 이면의 원리를 꿰뚫어 보는 통찰력과 스페셜리스트의 기질이 있습니다.",
  정인: "지적인 배움과 따뜻한 인정, 수용적인 사랑을 중요시합니다. 차분하게 상황을 흡수하고 사람들을 품어주는 든든한 학자적 면모가 있습니다.",
  비견: "누구에게도 의존하지 않고 자신의 발로 당당히 서고자 하는 강한 독립심과 자존감이 내면의 단단한 중심을 이룹니다.",
  겁재: "치열한 경쟁 속에서도 결코 주눅 들지 않는 강인한 투지와 승부욕을 지녔습니다. 동료들과 함께 큰 목표를 달성할 때 폭발적인 힘을 발휘합니다.",
}

interface GejuDef {
  detectedGeju: string
  code: string
  name: string
  badge: string
  meaning: string
  roleInLife: string
  advice: string
}

function detectGeju(monthBranchSipsung: SipsungNameDto): GejuDef {
  switch (monthBranchSipsung) {
    case "정관":
      return {
        detectedGeju: "정관격",
        code: "G1",
        name: "정관격(正官格)",
        badge: "신뢰와 원칙의 리더",
        meaning:
          "사회적 규범과 신뢰, 공공의 가치를 중시하며 반듯한 인품과 책임감으로 조직의 중심에 서는 격국입니다.",
        roleInLife:
          "조직이나 사회에서 공정하고 체계적인 룰을 세우고 사람들의 신망을 받는 리더 역할을 수행합니다.",
        advice:
          "완벽주의나 체면에 대한 집착을 조금 내려놓고, 자신에게도 너그러운 휴식을 허락할 때 품격이 더욱 빛납니다.",
      }
    case "편관":
      return {
        detectedGeju: "편관격",
        code: "G2",
        name: "편관격(七殺格)",
        badge: "위기를 돌파하는 카리스마 개혁가",
        meaning:
          "어려운 난관과 시험대 앞에서 물러서지 않고, 강한 승부욕과 결단력으로 판을 뒤흔드는 역동적인 격국입니다.",
        roleInLife:
          "위기 관리, 문제 해결, 경쟁이 치열한 분야에서 독보적인 실행력과 리더십을 발휘합니다.",
        advice:
          "혼자서 모든 짐을 짊어지려 하지 말고, 주변 사람들과 소통하며 스트레스와 건강 관리에 유의하세요.",
      }
    case "정재":
      return {
        detectedGeju: "정재격",
        code: "G3",
        name: "정재격(正財格)",
        badge: "성실과 안정의 탄탄한 자산가",
        meaning:
          "성실함과 현실적인 감각을 바탕으로 차곡차곡 신뢰와 자산을 쌓아 올리는 견고한 격국입니다.",
        roleInLife:
          "재무, 운영, 기획 등 체계적인 관리가 필요한 영역에서 빈틈없는 정확성으로 조직의 든든한 버팀목이 됩니다.",
        advice:
          "지나친 보수성이나 인색함에 갇히지 않도록, 때로는 새로운 배움과 경험에 유연하게 투자하는 결단이 필요합니다.",
      }
    case "편재":
      return {
        detectedGeju: "편재격",
        code: "G4",
        name: "편재격(偏財格)",
        badge: "넓은 안목의 비즈니스 승부사",
        meaning:
          "넓은 시야와 민첩한 네트워킹으로 돈과 사람, 기회의 큰 흐름을 엮어내는 사업가적 격국입니다.",
        roleInLife:
          "영업, 투자, 사업, 마케팅 등 유동성이 큰 환경에서 기회를 포착하고 판을 키우는 역할을 합니다.",
        advice:
          "흐름이 좋을 때일수록 지키는 관리(리스크 매니지먼트)를 철저히 해야 얻은 결실을 온전히 내 것으로 만들 수 있습니다.",
      }
    case "식신":
      return {
        detectedGeju: "식신격",
        code: "G5",
        name: "식신격(食神格)",
        badge: "재능과 풍요를 일구는 장인",
        meaning:
          "자신이 진정으로 즐기는 재능과 전문성을 꾸준히 연마하여 삶의 풍요와 결실을 맺는 격국입니다.",
        roleInLife:
          "전문 기술, 창작, 교육, 연구, 콘텐츠 등 나만의 특별한 무기를 바탕으로 사람들에게 가치를 전달합니다.",
        advice:
          "편안함과 안주에 머무르기보다는, 내 재능이 실질적인 결과물로 이어지도록 목표 기한과 실행 플랜을 세우세요.",
      }
    case "상관":
      return {
        detectedGeju: "상관격",
        code: "G8",
        name: "상관격(傷官格)",
        badge: "틀을 깨는 천재적 혁신가",
        meaning:
          "기존의 관습과 틀에 얽매이지 않고 번뜩이는 아이디어와 화려한 표현력으로 새바람을 일으키는 격국입니다.",
        roleInLife:
          "기획, PR, 미디어, 혁신 프로젝트, 예술 등 창의력과 언변이 핵심인 무대에서 독보적인 존재감을 드러냅니다.",
        advice:
          "말과 표현에 날이 서면 불필요한 마찰을 부를 수 있으니, 따뜻한 어조와 역지사지의 배려를 곁들이면 천하무적이 됩니다.",
      }
    case "편인":
      return {
        detectedGeju: "편인격",
        code: "G11",
        name: "편인격(偏印格)",
        badge: "비범한 통찰의 스페셜리스트",
        meaning:
          "남들이 쉽게 흉내 낼 수 없는 독창적인 학문, 기술, 예술적 직관을 깊게 파고드는 전문가 격국입니다.",
        roleInLife:
          "IT/데이터, 전략 기획, 심리/상담, 특수 기술 등 복잡하고 난해한 문제를 해결하는 브레인 역할을 합니다.",
        advice:
          "생각이 지나치게 많아져 현실 행동이 지연되지 않도록, 생각한 것을 작게라도 즉시 실행해보는 습관이 중요합니다.",
      }
    case "정인":
      return {
        detectedGeju: "정인격",
        code: "G12",
        name: "정인격(正印格)",
        badge: "지혜와 덕망을 갖춘 멘토",
        meaning:
          "깊은 학식과 품격 있는 인품으로 사람들에게 가르침과 선한 영향력을 베푸는 학자/교육자 격국입니다.",
        roleInLife:
          "교육, 학술 연구, 공공 기획, 자격증 전문직 등 지식과 인정을 기반으로 한 분야에서 존경을 받습니다.",
        advice:
          "이론이나 생각에 머물지 말고 현실적인 행동력과 독립성을 기르면 더욱 존경받는 성취를 이룹니다.",
      }
    case "비견":
      return {
        detectedGeju: "건록격",
        code: "G10",
        name: "건록격(建祿格)",
        badge: "맨손으로 일구는 자수성가형 리더",
        meaning:
          "튼튼한 신체와 굳센 의지로 남의 도움 없이 스스로 길을 개척하여 성공의 깃발을 꽂는 자립형 격국입니다.",
        roleInLife:
          "독립 창업, 전문직, 필드형 리더 등 자신의 뚝심과 체력, 주체성으로 성과를 증명하는 포지션에 적합합니다.",
        advice:
          "독불장군이 되지 않도록 동료들의 의견에 귀 기울이고 신뢰를 나누는 파트너십을 구축하세요.",
      }
    case "겁재":
    default:
      return {
        detectedGeju: "양인/겁재격",
        code: "G9",
        name: "양인/겁재격(羊刃·刧財格)",
        badge: "치열한 경쟁을 뚫는 승부사",
        meaning:
          "강력한 승부욕과 투지를 무기로 극한의 경쟁 환경에서도 끝내 정상을 차지하는 불굴의 격국입니다.",
        roleInLife:
          "스타트업, 고난도 프로젝트, 스포츠, 외과/응급, 승부가 분명한 비즈니스 전장에서 진가를 발휘합니다.",
        advice:
          "경쟁심이 과열되어 감정적인 대립으로 이어지지 않도록, 감정을 절제하고 명확한 계약과 원칙을 세우는 것이 안전합니다.",
      }
  }
}

export function generateEasyInterpretation(chart: SajuChartDto): EasyInterpretationDto {
  const dayStem = chart.dayHeavenlyStem
  const dayMaster = DAY_MASTER_INFO[dayStem] ?? {
    symbol: "자연의 기운",
    title: "독창적인 잠재력을 지닌 개척가",
    personality: "자신만의 고유한 빛깔로 세상과 마주하며 꾸준히 성장하는 기운을 지녔습니다.",
  }

  const dayBranchSipsung = chart.sipsungByPillar.day.branchFromMain
  const innerMind =
    INNER_MIND_BY_SIPSUNG[dayBranchSipsung] ??
    "스스로 중심을 잡고 상황에 맞게 유연하게 대처하는 지혜가 돋보입니다."

  // 격국 추정 (월지 본기 기준)
  const monthBranchSipsung = chart.sipsungByPillar.month.branchFromMain
  const gejuDef = detectGeju(monthBranchSipsung)

  // 오행 개수 집계
  const elementCounts: Record<FiveElement, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  const allPillars: PillarDto[] = [
    chart.pillars.year,
    chart.pillars.month,
    chart.pillars.day,
    chart.pillars.hour,
  ]

  for (const p of allPillars) {
    if (p.stemElement in elementCounts) elementCounts[p.stemElement]++
    if (p.branchElement in elementCounts) elementCounts[p.branchElement]++
  }

  const sortedElements = (Object.entries(elementCounts) as [FiveElement, number][]).sort(
    (a, b) => b[1] - a[1]
  )
  const maxCount = sortedElements[0][1]
  const strongest = sortedElements.filter(([, c]) => c === maxCount && c >= 2).map(([e]) => e)
  const weakest = sortedElements.filter(([, c]) => c === 0).map(([e]) => e)
  if (weakest.length === 0) {
    const minCount = sortedElements[sortedElements.length - 1][1]
    weakest.push(...sortedElements.filter(([, c]) => c === minCount && c <= 1).map(([e]) => e))
  }

  // 개운 팁 생성
  const prescriptions: string[] = []
  const elementTips: Record<FiveElement, string> = {
    목: "나무의 기운(성장과 시작): 초록색 계열의 옷이나 소품, 식물 기르기, 아침 숲길 산책, 새로운 배움 시작하기가 큰 활력을 줍니다.",
    화: "불의 기운(열정과 표현): 붉은색/따뜻한 톤, 밝은 조명, 규칙적인 유산소 운동, 모임에서의 적극적인 자기표현이 행운을 부릅니다.",
    토: "흙의 기운(안정과 포용): 베이지/브라운/노란색 계열, 규칙적인 식습관, 맨발 걷기나 흙 만지기, 신뢰를 지키는 태도가 중심을 잡아줍니다.",
    금: "쇠의 기운(결단과 정리): 흰색/메탈 계열 소품, 주변 정리정돈과 미니멀 라이프, 약속과 원칙 지키기, 호흡 운동이 운을 정화합니다.",
    수: "물의 기운(지혜와 유연함): 블랙/네이비 계열, 충분한 수분 섭취, 반신욕이나 수영, 명상과 독서를 통한 내면 충전이 길합니다.",
  }

  for (const w of weakest) {
    if (elementTips[w as FiveElement]) {
      prescriptions.push(elementTips[w as FiveElement])
    }
  }
  if (prescriptions.length === 0) {
    prescriptions.push(
      "오행이 전반적으로 고르게 조화를 이루고 있어, 균형 잡힌 생활 습관과 긍정적인 마음가짐만으로도 순조로운 흐름을 이어갈 수 있습니다."
    )
  }

  // 십성 카운트 및 직업/재물 분석
  const sipsungList: SipsungNameDto[] = [
    chart.sipsungByPillar.year.stem,
    chart.sipsungByPillar.year.branchFromMain,
    chart.sipsungByPillar.month.stem,
    chart.sipsungByPillar.month.branchFromMain,
    chart.sipsungByPillar.day.stem,
    chart.sipsungByPillar.day.branchFromMain,
    chart.sipsungByPillar.hour.stem,
    chart.sipsungByPillar.hour.branchFromMain,
  ]

  const countOf = (...names: SipsungNameDto[]) =>
    sipsungList.filter((s) => names.includes(s)).length

  const gwanCount = countOf("정관", "편관")
  const sikCount = countOf("식신", "상관")
  const jaeCount = countOf("정재", "편재")
  const inCount = countOf("정인", "편인")
  const biCount = countOf("비견", "겁재")

  // 직업/적성 도출
  let careerTitle = "전문성과 신뢰를 겸비한 핵심 인재"
  const strengths: string[] = []
  let recommendedFields = ""
  let workEnvironment = ""

  if (sikCount >= 2 && jaeCount >= 1) {
    careerTitle = "자신의 재능으로 부가가치를 창출하는 창의적 전문가"
    strengths.push("번뜩이는 기획력과 창의적인 아이디어", "실행에 옮겨 결실을 맺는 생산 능력")
    recommendedFields = "콘텐츠 제작, IT/스타트업, 상품 기획, 마케팅, 디자인, 전문 기술, 외식/유통"
    workEnvironment = "자율성이 보장되고 성과에 따른 보상이 즉각적인 역동적인 환경"
  } else if (gwanCount >= 2 || (gwanCount >= 1 && inCount >= 1)) {
    careerTitle = "조직의 중심에서 신뢰와 원칙을 세우는 리더"
    strengths.push("명확한 책임감과 준법정신", "체계적인 조직 관리 및 문제 해결 능력")
    recommendedFields = "공공기관, 대기업, 법률/행정, 인사/기획, 교육/연구, 전문 자격 라이선스 직종"
    workEnvironment = "시스템과 프로세스가 명확하고 명예와 직책이 존중받는 안정된 조직"
  } else if (jaeCount >= 2) {
    careerTitle = "기회를 포착하고 숫자에 밝은 실전 비즈니스맨"
    strengths.push("탁월한 현실 감각과 시장 흐름 파악", "신속한 의사결정과 넓은 인맥 관리")
    recommendedFields = "금융, 투자, 자산운용, 무역, 사업 경영, 영업/세일즈, 부동산"
    workEnvironment = "목표가 명확하고 시장의 흐름과 밀접하게 연동된 현장 중심의 환경"
  } else if (inCount >= 2) {
    careerTitle = "깊이 있는 지식과 통찰로 방향을 제시하는 브레인"
    strengths.push("심도 깊은 학습 능력과 분석력", "복잡한 개념을 체계화하고 조언하는 능력")
    recommendedFields = "연구 개발, 학술/교육, 컨설팅, 데이터 분석, 출판/저작, 심리/상담"
    workEnvironment = "독립적으로 사색하고 깊이 있는 연구를 지속할 수 있는 차분한 환경"
  } else {
    careerTitle = "남다른 자립심과 추진력으로 길을 개척하는 파이어니어"
    strengths.push("위기에도 꺾이지 않는 뚝심과 승부욕", "자신의 손으로 직접 성과를 증명하는 실행력")
    recommendedFields = "전문 프리랜서, 1인 기업, 벤처 창업, 기술 장인, 스포츠/현장 관리"
    workEnvironment = "간섭이 적고 스스로 주도권을 쥐고 일할 수 있는 독립적 환경"
  }

  // 재물 스타일
  let wealthTitle = "성실한 자산 축적형"
  let wealthPattern = "루틴을 지키며 차곡차곡 기반을 다져나가는 안정적인 재물 스타일입니다."
  let wealthAdvice =
    "무리한 빚이나 일확천금을 노리는 투기보다는, 검증된 자산과 실물 가치에 분산 투자하는 것이 가장 안전합니다."

  if (jaeCount >= 2 || countOf("편재") >= 1) {
    wealthTitle = "큰 흐름을 읽는 기회 포착형"
    wealthPattern =
      "돈의 흐름과 시장 기회를 빠르게 감지하며, 사람과 정보를 엮어 큰 수익을 창출하는 감각이 탁월합니다."
    wealthAdvice =
      "버는 힘이 강한 만큼 나가는 지출도 클 수 있으니, 수익의 일정 비율은 반드시 안전자산에 묶어두는 수성(守成)의 지혜가 필요합니다."
  } else if (sikCount >= 2) {
    wealthTitle = "전문 기술과 재능 기반형"
    wealthPattern =
      "남들이 대체하기 어려운 나만의 전문 기술, 자격, 콘텐츠 등 '손끝의 재능'이 곧 평생의 마르지 않는 재물 창고가 됩니다."
    wealthAdvice =
      "자신의 역량 개발에 아낌없이 투자하세요. 기술과 명성이 쌓일수록 재물은 저절로 따라오게 됩니다."
  }

  // 인간관계 스타일
  const relationshipTitle = `${dayMaster.title}의 품격`
  let relationshipDescription = ""
  let relationshipCaution = ""

  if (biCount >= 2) {
    relationshipDescription =
      "동료나 친구들과 대등하게 어깨를 나란히 하며 의리를 중시하는 솔직담백한 관계를 맺습니다."
    relationshipCaution =
      "자존심 대립이나 불필요한 경쟁심으로 소중한 인연과 부딪히지 않도록 한 걸음 양보하는 아량이 행운을 부릅니다."
  } else if (sikCount >= 2) {
    relationshipDescription =
      "주변 사람들에게 베풀기를 좋아하고 유쾌한 대화와 긍정적인 분위기로 사람들을 편안하게 해줍니다."
    relationshipCaution =
      "솔직한 마음에 무심코 던진 한마디가 상대방에게 오해를 살 수 있으니 언어의 온도를 늘 부드럽게 유지하세요."
  } else {
    relationshipDescription =
      "예의와 신의를 바탕으로 선을 넘지 않으며, 진실하고 깊이 있는 소수의 인연을 소중히 여깁니다."
    relationshipCaution =
      "자신의 속마음이나 고민을 혼자 삭이지 말고, 신뢰할 수 있는 사람과 조금씩 감정을 나누면 마음이 한결 가벼워집니다."
  }

  // 올해 세운 가이드
  const firstSaeun = chart.saeun[0]
  const currentYear = firstSaeun?.year ?? new Date().getFullYear()
  const currentYearGanzhi = firstSaeun?.ganzhi ?? "올해"
  const currentYearInsight = firstSaeun
    ? `${currentYear}년(${currentYearGanzhi}년)은 천간에 [${firstSaeun.stemSipsung}], 지지에 [${firstSaeun.branchSipsung}]의 기운이 들어오는 시기입니다. ${
        firstSaeun.stemSipsung.includes("재")
          ? "경제적 활동과 결실, 실질적인 기회 창출에 집중하기에 좋은 흐름입니다."
          : firstSaeun.stemSipsung.includes("관")
            ? "사회적 인정, 책임과 권한, 직책의 상승 및 질서를 다잡기에 유리한 시기입니다."
            : firstSaeun.stemSipsung.includes("인")
              ? "학습과 자격증 취득, 문서 계약, 내실을 다지며 스스로를 업그레이드하기에 적합합니다."
              : firstSaeun.stemSipsung.includes("식")
                ? "자신의 재능과 아이디어를 널리 알리고 새로운 도전을 시작하기에 좋은 타이밍입니다."
                : "동료나 협력자와의 파트너십을 넓히고 자신의 주체성을 견고하게 다지는 해입니다."
      }`
    : "현재 운세는 새로운 성장과 도약을 준비하는 중요한 전환점에 서 있습니다."

  // 건강 관리 분석
  const healthVulnerabilities: Record<FiveElement, { area: string; desc: string }> = {
    목: {
      area: "간, 담(쓸개), 눈(시력), 신경계 및 목/어깨 근육",
      desc: "피로가 쉽게 간에 쌓이거나 눈이 침침해지고, 스트레스를 받으면 목과 어깨가 뻣뻣하게 굳는 경향이 있습니다.",
    },
    화: {
      area: "심장, 혈압 및 혈관 순환계, 소장, 수면 리듬",
      desc: "가슴 두근거림이나 상열감(얼굴 홍조), 불면증, 혈액순환 저하에 주의해야 하며 감정의 급격한 기복을 다스려야 합니다.",
    },
    토: {
      area: "위장, 췌장, 소화기 계통, 복부 및 피부",
      desc: "소화 불량이나 복부 팽만, 위염에 취약할 수 있으며, 생각이나 걱정이 많아지면 바로 식욕과 위장으로 신호가 옵니다.",
    },
    금: {
      area: "폐, 기관지/호흡기, 대장, 비염, 관절 및 피부 건조",
      desc: "환절기 호흡기 질환(감기, 비염)이나 대장 질환에 민감하며, 건조한 환경에서 피부 트러블이나 피로감이 심해질 수 있습니다.",
    },
    수: {
      area: "신장, 방광, 비뇨/생식기, 부종, 수족냉증, 허리",
      desc: "하체 냉증이나 붓기, 비뇨기 계통의 피로가 생기기 쉬우며 몸이 차가워지지 않도록 체온 유지와 신장 관리가 핵심입니다.",
    },
  }

  const vulnerableKey: FiveElement =
    weakest.length > 0 && weakest[0] in healthVulnerabilities
      ? (weakest[0] as FiveElement)
      : (sortedElements[0][0] as FiveElement)

  const healthAreaInfo = healthVulnerabilities[vulnerableKey]
  const healthCare = {
    vulnerableAreas: [healthAreaInfo.area],
    description: `오행 중 [${vulnerableKey}(${healthAreaInfo.area})] 기운의 균형 관리가 핵심 건강 포인트입니다. ${healthAreaInfo.desc}`,
    lifestyleAdvice:
      vulnerableKey === "목"
        ? "충분한 수면과 밤 11시 전 취침으로 간을 해독하고, 눈의 피로를 풀어주는 온찜질과 스트레칭을 자주 해주세요."
        : vulnerableKey === "화"
          ? "흥분을 가라앉히는 차분한 유산소 운동(산책, 조깅)과 함께 맵고 자극적인 음식을 줄이고 차(Tea)를 즐겨보세요."
          : vulnerableKey === "토"
            ? "식사 시간을 일정하게 지키고 찬 음식과 밀가루를 줄이며, 식후 가벼운 15분 걷기로 소화기를 지켜주세요."
            : vulnerableKey === "금"
              ? "건조하지 않도록 실내 습도를 50~60%로 유지하고, 따뜻한 물 자주 마시기와 깊은 복식호흡이 폐 건강을 돕습니다."
              : "찬물이나 찬 음료를 피하고 족욕이나 반신욕으로 아랫배와 발을 따뜻하게 보호해 신장과 방광을 보살피세요.",
  }

  // 하지 말아야 할 것 & 조심해야 할 것 & 가까이 할 것
  const doNotDo: string[] = []
  const cautions: string[] = []
  const keepClose: string[] = []


  if (biCount >= 2) {
    doNotDo.push(
      "지나친 자존심 대립으로 믿음직한 동료나 파트너와 한순간에 척지는 일",
      "독단적으로 결정을 내리고 나중에 주변에 통보하는 방식"
    )
    cautions.push(
      "동업이나 금전 거래 시 서류 없이 '우정/의리'만 믿고 계약을 소홀히 하는 일",
      "욱하는 감정이 올라올 때 즉석에서 승부를 보려는 조급함"
    )
    keepClose.push(
      "냉철하고 객관적으로 현실을 짚어주는 솔직한 조언자",
      "서로의 자율성을 존중하며 각자의 영역에서 시너지를 내는 협력자"
    )
  } else if (sikCount >= 2) {
    doNotDo.push(
      "감정에 취해 실현 불가능한 호언장담이나 섣부른 약속을 남발하는 일",
      "상대방의 약점이나 자존심을 건드리는 날카로운 직설화법"
    )
    cautions.push(
      "시작만 거창하고 뒷수습이 흐지부지되는 용두사미 습관",
      "오지랖으로 남의 일에 과도하게 개입하여 정작 내 실속을 놓치는 일"
    )
    keepClose.push(
      "나의 창의적인 아이디어를 구체적인 결과물로 기획·마무리해 주는 실무형 인재",
      "내 말에 진심으로 공감하고 긍정적인 피드백을 주는 따뜻한 사람"
    )
  } else if (jaeCount >= 2) {
    doNotDo.push(
      "무리한 레버리지(대출)나 검증되지 않은 투자처에 일확천금을 노리고 올인하는 일",
      "일과 돈에만 매몰되어 건강과 소중한 가족 관계를 희생시키는 일"
    )
    cautions.push(
      "겉포장이 화려한 투자 제안이나 달콤한 유혹에 충동적으로 서명하는 일",
      "수입이 많을 때 지출도 덩달아 불어나는 과소비/품위 유지비 누수"
    )
    keepClose.push(
      "보수적이고 꼼꼼하게 자산을 지키고 리스크를 점검해 주는 원칙주의자",
      "마음을 터놓고 물질적 계산 없이 쉴 수 있는 편안한 안식처"
    )
  } else if (gwanCount >= 2) {
    doNotDo.push(
      "모든 책임과 과오를 혼자 짊어지려 하며 스스로를 가혹하게 자책하는 일",
      "타인의 시선과 체면 때문에 감당하기 힘든 부탁을 거절하지 못하는 일"
    )
    cautions.push(
      "완벽주의 강박으로 인한 만성 번아웃과 불면증",
      "조직 내 위계나 규칙에 갇혀 새로운 유연한 기회를 지레 포기하는 일"
    )
    keepClose.push(
      "나의 무거운 책임감을 덜어주고 웃음을 주는 유쾌하고 긍정적인 친구",
      "일과 일상을 분리하고 온전히 나만의 휴식을 누릴 수 있는 고요한 공간"
    )
  } else {
    doNotDo.push(
      "머릿속으로 생각만 맴돌고 실제 행동은 내일로 미루는 우유부단함",
      "혼자만의 생각에 갇혀 주변의 건전한 조언을 색안경 끼고 의심하는 일"
    )
    cautions.push(
      "과거의 상처나 서운한 감정을 오래도록 곱씹으며 스스로를 고립시키는 일",
      "현실적인 경제 감각을 도외시한 채 이상에만 치우치는 판단"
    )
    keepClose.push(
      "행동력이 뛰어나고 나를 현실 밖으로 이끌어 주는 에너제틱한 러닝메이트",
      "새로운 영감과 배움을 주는 양질의 책과 지적 대화의 자리"
    )
  }

  doNotDo.push("분노나 흥분 상태에서 중대한 계약이나 관계의 단절을 즉흥적으로 결정하는 일")
  cautions.push("몸의 피로 신호를 무시하고 일정을 무리하게 강행하여 면역력이 떨어지는 것")
  keepClose.push("매일 아침 10분간의 고요한 마인드셋 정리와 따뜻한 차 한 잔의 루틴")

  // 행운의 오행 소품/색상/환경
  const luckyColorMap: Record<FiveElement, string> = {
    목: "그린, 청록, 에메랄드, 파스텔 톤",
    화: "레드, 오렌지, 핑크, 따뜻한 웜톤",
    토: "베이지, 옐로우, 브라운, 카멜 톤",
    금: "화이트, 실버, 골드, 메탈릭 톤",
    수: "블랙, 네이비, 차콜, 딥블루 톤",
  }
  const luckyItemMap: Record<FiveElement, string> = {
    목: "원목 가구, 생화/화분, 패브릭 소품, 만년필, 책",
    화: "향초, 조명 스탠드, 선글라스, 스마트 워치, 운동 기구",
    토: "도자기 머그컵, 가죽 지갑, 황토 소품, 스톤 액세서리",
    금: "금속 액세서리, 메탈 시계, 고급 안경테, 칼/가위 정돈함",
    수: "가습기, 어항/수족관, 분수대 소품, 수첩, 유리 공예품",
  }
  const luckyEnvMap: Record<FiveElement, string> = {
    목: "수목원, 도서관, 공원 숲길, 활기찬 아침 시장",
    화: "햇살 가득한 카페, 콘서트/공연장, 전시장, 피트니스 센터",
    토: "한옥 마을, 흙길 둘레길, 고풍스러운 서점, 정갈한 식당",
    금: "현대적인 빌딩가, 보석/귀금속 샵, 깔끔하게 정돈된 미니멀 룸",
    수: "잔잔한 호숫가, 바다 전망 명소, 스파/온천, 야경이 보이는 라운지",
  }

  const luckyElements = {
    colors: luckyColorMap[vulnerableKey] ?? "화이트, 네이비",
    items: luckyItemMap[vulnerableKey] ?? "다이어리, 시계",
    environment: luckyEnvMap[vulnerableKey] ?? "자연 채광이 좋은 차분한 공간",
  }

  // 운수 대통할 때 vs 운수 안 좋을 때 (Fortune Timing)
  const fortuneTiming = {
    peakLuck: {
      signs: [
        "오랫동안 얽혀있던 문제나 복잡한 협상이 뜻밖의 귀인을 만나 순식간에 해결됩니다.",
        "사소하게 낸 아이디어나 기획이 상사나 대중의 큰 호응을 얻으며 주목받습니다.",
        "아침에 일어날 때 머리가 맑고, 매사에 긍정적인 직관과 자신감이 샘솟습니다.",
        "능력 있는 파트너들이 먼저 찾아와 매력적인 협업이나 기회를 제안합니다.",
      ],
      strategy:
        "운이 최고조에 올랐을 때는 기회를 놓치지 말고 과감하게 판을 넓히되, 혼자 독식하지 않고 결실을 주변과 나누어야 합니다. 기세를 탈 때 명확한 시스템과 문서로 기반을 다져두면 평생의 든든한 자산이 됩니다.",
    },
    lowLuck: {
      signs: [
        "별 뜻 없이 던진 한마디가 와전되어 주변의 오해를 사거나 사소한 구설이 생깁니다.",
        "몸이 물에 젖은 솜처럼 무겁고, 사소한 일에도 쉽게 짜증과 조급함이 올라옵니다.",
        "사기, 물건 분실, 예상치 못한 지출이 연쇄적으로 일어나며 흐름이 꼬입니다.",
        "기존에 잘되던 일에 갑작스러운 일정 지연이나 파트너의 변심이 발생합니다.",
      ],
      strategy:
        "운이 잠시 내려앉을 때는 무리하게 반격하거나 큰 승부수를 던지면 손실만 커집니다. '웅크린 호랑이'처럼 활동 반경을 좁히고, 신규 투자나 계약을 잠시 보류하며 내실을 다지고 체력을 비축하세요. 공부하고 쉬어가는 시간으로 삼으면 다음 상승기 때 폭발적으로 도약할 수 있습니다.",
    },
  }

  const lifeLesson = `당신은 ${dayMaster.symbol}처럼 ${dayMaster.title}의 고귀한 그릇을 지니고 태어났습니다. 사주의 강점을 살려 자신만의 속도로 걸어갈 때 세상은 가장 큰 보답을 해줄 것입니다.`

  const oneLineSummary = `${dayMaster.title} · ${gejuDef.badge}`
  const keywords = [
    dayMaster.symbol,
    gejuDef.name.replace(/[\(（].*?[\)）]/g, ""),
    chart.strength.level,
    careerTitle.split(" ")[0],
    `월지 ${monthBranchSipsung}`,
  ]

  return {
    oneLineSummary,
    keywords,
    dayMasterStory: {
      stem: dayStem,
      title: dayMaster.title,
      symbol: dayMaster.symbol,
      personality: dayMaster.personality,
      innerMind,
    },
    gejuAnalysis: gejuDef,
    careerAndTalent: {
      title: careerTitle,
      strengths,
      recommendedFields,
      workEnvironment,
    },
    wealthStyle: {
      title: wealthTitle,
      pattern: wealthPattern,
      advice: wealthAdvice,
    },
    relationshipStyle: {
      title: relationshipTitle,
      description: relationshipDescription,
      caution: relationshipCaution,
    },
    elementBalance: {
      counts: elementCounts,
      strongest,
      weakest,
      prescriptions,
    },
    luckAdvice: {
      currentYear,
      currentYearGanzhi,
      currentYearInsight,
      lifeLesson,
    },
    healthCare,
    lifeGuidance: {
      doNotDo,
      cautions,
      keepClose,
      luckyElements,
    },
    fortuneTiming,
  }
}

