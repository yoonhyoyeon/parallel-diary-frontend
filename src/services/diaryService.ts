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

export interface RecommendedActivity {
  id: string;
  emoji: string;
  title: string;
  content: string;
  parallelDiaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParallelDiary {
  id: string;
  content: string;
  diaryId: string;
  createdAt: string;
  updatedAt: string;
  recommendedActivities: RecommendedActivity[];
}

export interface ParallelDiaryDetail extends ParallelDiary {
  diary: Diary;
}

export interface Diary {
  id: string;
  content: string;
  keywords: string[];
  writtenAt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  parallelDiary?: ParallelDiary;
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

export async function getDiaries(): Promise<Diary[]> {
  return apiClient<Diary[]>(
    '/diaries',
    {
      method: 'GET',
    },
    'api'
  );
}

export async function getDiariesByDate(date: string): Promise<Diary[]> {
  return apiClient<Diary[]>(
    `/diaries/by-date/${date}`,
    {
      method: 'GET',
    },
    'api'
  );
}

export async function getDiary(id: string): Promise<Diary> {
  return apiClient<Diary>(
    `/diaries/${id}`,
    {
      method: 'GET',
    },
    'api'
  );
}

export async function getParallelDiary(id: string): Promise<ParallelDiaryDetail> {
  return apiClient<ParallelDiaryDetail>(
    `/parallel-diaries/${id}`,
    {
      method: 'GET',
    },
    'api'
  );
}

export async function getRecommendedActivities(): Promise<RecommendedActivity[]> {
  return apiClient<RecommendedActivity[]>(
    '/recommended-activities',
    {
      method: 'GET',
    },
    'api'
  );
}

export interface TopKeyword {
  keyword: string;
  count: number;
}

export async function getTopKeywords(): Promise<TopKeyword[]> {
  return apiClient<TopKeyword[]>(
    '/diaries/keywords/top',
    {
      method: 'GET',
    },
    'api'
  );
}

export interface DiaryActivity {
  date: string;
  diary: boolean;
}

export async function getDiaryActivity(): Promise<DiaryActivity[]> {
  return apiClient<DiaryActivity[]>(
    '/diaries/stats/activity',
    {
      method: 'GET',
    },
    'api'
  );
}

export interface CreateIntegratedDiaryRequest {
  originalContent: string;
  writtenAt: string; // ISO 8601 format (e.g., "2025-11-23T00:00:00.000Z")
}

/**
 * 일반 일기와 평행 일기를 한 번에 생성합니다.
 * @param originalContent 원본 일기 내용
 * @param writtenAt 작성 날짜 (ISO 8601 형식)
 * @returns 생성된 일기 (평행 일기 포함)
 */
export async function createIntegratedDiary(
  originalContent: string,
  writtenAt: string
): Promise<Diary> {
  return apiClient<Diary>(
    '/diaries/integrated',
    {
      method: 'POST',
      body: JSON.stringify({
        originalContent,
        writtenAt,
      }),
    },
    'api'
  );
}

export interface MonotonyIndex {
  id: string;
  date: string; // ISO 8601 format
  index: number; // 0-100 (단조로움 지수)
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 사용자의 단조로움 지수 전체 조회
 * @returns 단조로움 지수 배열
 */
export async function getMonotonyIndices(): Promise<MonotonyIndex[]> {
  return apiClient<MonotonyIndex[]>(
    '/monotony-indices',
    {
      method: 'GET',
    },
    'api'
  );
}

