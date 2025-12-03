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

