/**
 * OpenAI GPT API를 사용하여 추천 활동의 상세 정보를 생성하는 서비스
 */

export interface RecommendedPlace {
  name: string;
  address: string;
  description: string;
  category: string;
}

export interface ActivityDetailData {
  id: string;
  emoji: string;
  title: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  tips: string[];
  estimatedTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
  tags: string[];
  recommendedPlaces: RecommendedPlace[];
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
  "recommendedPlaces": [
    {
      "name": "실제 장소명 (구체적으로)",
      "address": "주소 (서울 기준, 구체적으로)",
      "description": "이 장소를 추천하는 이유 (1-2문장)",
      "category": "카테고리 (예: '카페', '미술관', '공원', '레스토랑' 등)"
    }
  ]
}

recommendedPlaces는 3-4개 정도 추천해주세요. 실제로 존재하는 유명한 장소나 일반적인 장소 유형을 추천해주세요.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 일상 활동을 추천하고 상세 정보를 제공하는 전문가입니다. 사용자가 활동을 선택할 때 도움이 되는 매력적이고 실용적인 정보를 제공해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
      recommendedPlaces: parsedContent.recommendedPlaces || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('GPT API 호출 중 오류:', error);
    throw error;
  }
}

