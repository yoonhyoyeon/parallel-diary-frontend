/**
 * 추천 활동 상세 정보를 localStorage에 저장하고 관리하는 유틸리티
 */

import type { ActivityDetailData } from './openaiService';

const STORAGE_KEY = 'activity_details';

/**
 * localStorage에서 모든 활동 상세 정보 가져오기
 */
function getAllActivityDetails(): Record<string, ActivityDetailData> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('localStorage 읽기 오류:', error);
    return {};
  }
}

/**
 * localStorage에 활동 상세 정보 저장
 */
function saveActivityDetail(activityId: string, detail: ActivityDetailData): void {
  try {
    const allDetails = getAllActivityDetails();
    allDetails[activityId] = detail;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allDetails));
  } catch (error) {
    console.error('localStorage 저장 오류:', error);
    throw new Error('활동 상세 정보 저장에 실패했습니다.');
  }
}

/**
 * ID로 활동 상세 정보 조회
 */
export function getActivityDetailById(activityId: string): ActivityDetailData | null {
  const allDetails = getAllActivityDetails();
  return allDetails[activityId] || null;
}

/**
 * 활동 상세 정보 저장
 */
export function saveActivityDetailById(activityId: string, detail: ActivityDetailData): void {
  saveActivityDetail(activityId, detail);
}

/**
 * localStorage에서 활동 상세 정보 삭제
 */
export function deleteActivityDetailById(activityId: string): void {
  try {
    const allDetails = getAllActivityDetails();
    delete allDetails[activityId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allDetails));
  } catch (error) {
    console.error('localStorage 삭제 오류:', error);
    throw new Error('활동 상세 정보 삭제에 실패했습니다.');
  }
}

/**
 * 모든 활동 상세 정보 초기화
 */
export function clearAllActivityDetails(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('localStorage 초기화 오류:', error);
    throw new Error('활동 상세 정보 초기화에 실패했습니다.');
  }
}

/**
 * 활동 상세 정보가 localStorage에 존재하는지 확인
 */
export function hasActivityDetail(activityId: string): boolean {
  return getActivityDetailById(activityId) !== null;
}

