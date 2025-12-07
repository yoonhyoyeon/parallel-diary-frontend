/**
 * 네이버 지역 검색 API 서비스
 * https://developers.naver.com/docs/serviceapi/search/local/local.md
 */

export interface NaverPlace {
  title: string;          // 업체명 (HTML 태그 포함 가능)
  link: string;           // 업체 상세 정보 URL
  category: string;       // 업체 분류 정보
  description: string;    // 업체 설명
  telephone: string;      // 전화번호 (비어있을 수 있음)
  address: string;        // 지번 주소
  roadAddress: string;    // 도로명 주소
  mapx: string;           // x 좌표 (경도)
  mapy: string;           // y 좌표 (위도)
}

export interface NaverLocalSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: Array<NaverPlace>;
}

/**
 * HTML 태그 제거 함수
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<\/?b>/g, '');
}

/**
 * 네이버 지역 검색 API 호출
 * @param query 검색 키워드
 * @param display 결과 개수 (최대 5)
 */
export async function searchNaverLocal(
  query: string,
  display: number = 1
): Promise<Array<NaverPlace>> {
  try {
    const encodedQuery = encodeURIComponent(query);
    // Vite 프록시를 통해 호출 (CORS 우회)
    const url = `/api/naver/v1/search/local.json?query=${encodedQuery}&display=${Math.min(display, 5)}&start=1`;

    const response = await fetch(url, {
      method: 'GET',
      
    });

    if (!response.ok) {
      throw new Error(`네이버 API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const data: NaverLocalSearchResponse = await response.json();

    // HTML 태그 제거 및 데이터 정제
    return data.items.map((item) => ({
      ...item,
      title: stripHtmlTags(item.title),
    }));
  } catch (error) {
    console.error('네이버 지역 검색 API 호출 중 오류:', error);
    return [];
  }
}

/**
 * 여러 키워드로 병렬 검색하여 키워드당 1개씩 반환
 */
export async function searchMultipleKeywords(
  keywords: Array<string>
): Promise<Array<NaverPlace>> {
  const results = await Promise.all(
    keywords.map((keyword) => searchNaverLocal(keyword, 1))
  );

  // 모든 결과를 하나의 배열로 합치기 (키워드당 1개씩)
  const allPlaces = results.flat();
  
  return allPlaces;
}

