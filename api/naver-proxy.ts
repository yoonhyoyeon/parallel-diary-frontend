import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req;
    
    // /api/naver/ 이후의 경로 추출
    const naverPath = url?.replace(/^\/api\/naver/, '') || '';
    
    // 네이버 API 키
    const clientId = process.env.VITE_NAVER_CLIENT_ID;
    const clientSecret = process.env.VITE_NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        error: '네이버 API 키가 설정되지 않았습니다.' 
      });
    }

    // 네이버 API 호출
    const naverUrl = `https://openapi.naver.com${naverPath}`;
    const response = await fetch(naverUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `네이버 API 호출 실패: ${response.statusText}`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('네이버 프록시 에러:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    });
  }
}

