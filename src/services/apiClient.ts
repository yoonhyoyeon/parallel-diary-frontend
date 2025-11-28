export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}, type: 'api' | 'ai' = 'api'): Promise<T> {
  const baseUrl = type === 'api' ? import.meta.env.VITE_API_BASE_URL ?? '' : import.meta.env.VITE_AI_API_BASE_URL ?? '';
  if (!baseUrl) {
    throw new ApiError(`${type} API 기본 URL이 설정되지 않았습니다. ${type === 'api' ? 'VITE_API_BASE_URL' : 'VITE_AI_API_BASE_URL'}을 확인해주세요.`, 0);
  }

  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (isJson && (payload as { message?: string }).message) || '요청 처리 중 문제가 발생했습니다.';
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

// SSE 스트리밍 함수
export async function streamChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  const baseUrl = import.meta.env.VITE_AI_API_BASE_URL ?? '/api/ai';

  try {
    const response = await fetch(`${baseUrl}/chat/chat-sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new ApiError('스트리밍 요청 실패', response.status);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new ApiError('응답 스트림을 읽을 수 없습니다.', 0);
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      console.log('buffer -> ', buffer);

      // "data: "를 구분자로 split
      const chunks = buffer.split('data: ');
      // 마지막 청크는 불완전할 수 있으므로 버퍼에 보관
      buffer = 'data: ' + (chunks.pop() || '');

      for (const chunk of chunks) {
        if (chunk) { // 첫 번째 빈 문자열 제외
          // 끝의 \n\n 제거 (SSE 이벤트 구분자)
          const content = chunk.replace(/\n\n$/, '');
          console.log('content -> ', content);
          if (content) {
            onChunk(content);
          }
        }
      }
    }

    // 남은 버퍼 처리
    if (buffer && buffer.startsWith('data: ')) {
      const content = buffer.slice(6).replace(/\n\n$/, '');
      if (content) {
        onChunk(content);
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.'));
  }
}
