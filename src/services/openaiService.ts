/**
 * OpenAI GPT API를 사용하여 추천 활동의 상세 정보를 생성하는 서비스
 */

// NaverPlace 타입 import
import type { NaverPlace } from './naverLocalService';

export interface PlaceSearchKeyword {
  keyword: string;
  reason: string;
}

export interface ActivityDetailData {
  id: string;
  emoji: string;
  title: string;
  description: string;
  detailedDescription: string;
  benefits: Array<string>;
  tips: Array<string>;
  estimatedTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
  tags: Array<string>;
  placeSearchKeywords?: Array<PlaceSearchKeyword>; // 키워드 + 추천 이유
  recommendedPlaces?: Array<NaverPlace>; // 네이버 검색 결과 캐시 (optional)
  generatedAt: string;
}

/**
 * GPT API를 호출하여 활동 상세 정보 생성
 */
export async function generateActivityDetail(
  activity: {
    id: string;
    emoji: string;
    title: string;
    description: string;
  }
): Promise<ActivityDetailData> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const prompt = `다음 활동에 대한 상세 정보를 생성해주세요.

활동명: ${activity.title}
간단 설명: ${activity.description}

다음 형식의 JSON으로 응답해주세요 (JSON 형식만 출력하고 다른 텍스트는 포함하지 마세요):
{
  "detailedDescription": "활동에 대한 더 자세하고 매력적인 설명 (2-3문장)",
  "benefits": ["이 활동의 장점이나 기대 효과 (3-4개의 항목)"],
  "tips": ["활동을 즐기기 위한 팁이나 추천사항 (3-4개의 항목)"],
  "estimatedTime": "예상 소요 시간 (예: '30분~1시간', '2~3시간' 등)",
  "difficulty": "쉬움" 또는 "보통" 또는 "어려움",
  "tags": ["관련 태그 (3-5개, 예: '휴식', '창의성', '건강' 등)"],
  "placeSearchKeywords": [
    {
      "keyword": "네이버 지역 검색 키워드",
      "reason": "이 장소를 추천하는 이유 (한 문장)"
    }
  ]
}

⚠️ 중요: placeSearchKeywords는 3-4개의 객체 배열로 생성해주세요.
- keyword: 검색 결과가 나올 수 있는 일반적인 키워드
  > 좋은 예: "서울 카페", "강남 미술관", "홍대 서점", "이태원 레스토랑"
  > 나쁜 예: "블루보틀 카페", "국립현대미술관 서울관" (너무 구체적)
  > 지역명 + 장소 카테고리 조합으로 만들어주세요. 구체적인 상호명은 절대 사용하지 마세요.
  > 만약, 활동명이 "내 방 청소", "온라인 스터디", "경쟁팀 작품 심층 분석", "옛 지인에게 연락" 등 과 같이 장소 추천이 불필요하다면, placeSearchKeywords는 빈 배열로 생성해주세요.
- reason: 왜 이 장소를 추천하는지 구체적인 이유 (30자 이내)
  > 예: "조용한 분위기에서 작품 감상에 집중할 수 있어요"`;


  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 일상 활동을 추천하고 상세 정보를 제공하는 전문가입니다. 사용자가 활동을 선택할 때 도움이 되는 매력적이고 실용적인 정보를 제공해주세요. 장소 추천을 위해 네이버 지역 검색에서 사용할 구체적이고 검색 가능한 키워드를 생성해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`GPT API 호출 실패: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('GPT API 응답이 비어있습니다.');
    }

    // JSON 파싱
    const parsedContent = JSON.parse(content.trim());

    return {
      id: activity.id,
      emoji: activity.emoji,
      title: activity.title,
      description: activity.description,
      detailedDescription: parsedContent.detailedDescription,
      benefits: parsedContent.benefits,
      tips: parsedContent.tips,
      estimatedTime: parsedContent.estimatedTime,
      difficulty: parsedContent.difficulty,
      tags: parsedContent.tags,
      placeSearchKeywords: parsedContent.placeSearchKeywords || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('GPT API 호출 중 오류:', error);
    throw error;
  }
}
