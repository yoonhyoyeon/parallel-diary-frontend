import { apiClient } from './apiClient';

export interface DiaryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateDiaryRequest {
  messages: DiaryMessage[];
}

export interface GenerateDiaryResponse {
  content: string;
}

export async function generateDiary(messages: DiaryMessage[]): Promise<GenerateDiaryResponse> {
  return apiClient<GenerateDiaryResponse>(
    '/diary/make-diary',
    {
      method: 'POST',
      body: JSON.stringify({ messages }),
    },
    'ai'
  );
}

