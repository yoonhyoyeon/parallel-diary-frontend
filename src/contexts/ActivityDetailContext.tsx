import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ActivityDetailData } from '@/services/openaiService';
import { 
  getActivityDetailById, 
  saveActivityDetailById 
} from '@/services/activityDetailStorage';

type ActivityStatus = 
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'complete'; data: ActivityDetailData }
  | { type: 'error'; error: string };

type ActivityDetailContextType = {
  // 상태 맵 (리렌더링 트리거용)
  statusMap: Map<string, ActivityStatus>;
  
  // 상태 조회
  getStatus: (id: string) => ActivityStatus;
  
  // 상태 변경
  setLoading: (id: string) => void;
  setComplete: (id: string, data: ActivityDetailData) => void;
  setError: (id: string, error: string) => void;
  clear: (id: string) => void;
  
  // 편의 함수
  isLoading: (id: string) => boolean;
  hasData: (id: string) => boolean;
  getData: (id: string) => ActivityDetailData | null;
};

const ActivityDetailContext = createContext<ActivityDetailContextType | null>(null);

export function ActivityDetailProvider({ children }: { children: ReactNode }) {
  const [statusMap, setStatusMap] = useState<Map<string, ActivityStatus>>(new Map());

  // localStorage에서 초기 데이터 복원
  useEffect(() => {
    // 모든 캐시된 데이터를 전역 상태로 로드할 필요는 없음
    // 필요할 때 getStatus에서 lazy load
  }, []);

  const getStatus = (id: string): ActivityStatus => {
    // 1. 메모리에 있으면 반환
    const memoryStatus = statusMap.get(id);
    if (memoryStatus) {
      return memoryStatus;
    }

    // 2. localStorage 확인
    const cached = getActivityDetailById(id);
    if (cached) {
      // 메모리에도 캐시
      setStatusMap(prev => new Map(prev).set(id, { type: 'complete', data: cached }));
      return { type: 'complete', data: cached };
    }

    return { type: 'idle' };
  };

  const setLoading = (id: string) => {
    setStatusMap(prev => new Map(prev).set(id, { type: 'loading' }));
    console.log(`🔄 상태 변경: ${id} → loading`);
  };

  const setComplete = (id: string, data: ActivityDetailData) => {
    // 메모리에 저장
    setStatusMap(prev => new Map(prev).set(id, { type: 'complete', data }));
    
    // localStorage에도 저장 (영구 보존)
    saveActivityDetailById(id, data);
    
    console.log(`✅ 상태 변경: ${id} → complete`);
  };

  const setError = (id: string, error: string) => {
    setStatusMap(prev => new Map(prev).set(id, { type: 'error', error }));
    console.error(`❌ 상태 변경: ${id} → error:`, error);
  };

  const clear = (id: string) => {
    setStatusMap(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const isLoading = (id: string) => {
    const status = getStatus(id);
    return status.type === 'loading';
  };

  const hasData = (id: string) => {
    const status = getStatus(id);
    return status.type === 'complete';
  };

  const getData = (id: string): ActivityDetailData | null => {
    const status = getStatus(id);
    return status.type === 'complete' ? status.data : null;
  };

  return (
    <ActivityDetailContext.Provider
      value={{
        statusMap,
        getStatus,
        setLoading,
        setComplete,
        setError,
        clear,
        isLoading,
        hasData,
        getData,
      }}
    >
      {children}
    </ActivityDetailContext.Provider>
  );
}

export function useActivityDetail() {
  const context = useContext(ActivityDetailContext);
  if (!context) {
    throw new Error('useActivityDetail must be used within ActivityDetailProvider');
  }
  return context;
}

/**
 * 특정 활동의 상태를 구독하는 훅 (자동 리렌더링)
 */
export function useActivityStatus(id: string): ActivityStatus {
  const context = useContext(ActivityDetailContext);
  if (!context) {
    throw new Error('useActivityStatus must be used within ActivityDetailProvider');
  }

  const { statusMap, getStatus } = context;
  
  // statusMap이 변경될 때마다 리렌더링됨
  // statusMap을 의존성으로 사용하여 자동 리렌더링 트리거
  useEffect(() => {
    // statusMap 변경 감지용
  }, [statusMap]);
  
  return getStatus(id);
}

