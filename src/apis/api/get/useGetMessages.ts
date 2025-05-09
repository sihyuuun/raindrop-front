// src/apis/api/message/useGetMessages.ts

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { MessageGetResponse } from "@/types/message.types";

/**
 * 메시지 조회를 위한 커스텀 훅
 *
 * 해당 훅은 sceneId(암호화된 씬 ID)를 기반으로 해당 씬의 메시지 목록을 서버로부터 가져옵니다.
 * TanStack Query의 useQuery를 사용하여 자동 캐싱, 상태 관리, 비동기 처리를 제공합니다.
 *
 * @param {string} sceneId - 조회할 씬의 ID (암호화된 문자열)
 * @param {boolean} [enabled=true] - 해당 쿼리의 활성화 여부 (sceneId가 없을 때 false로 처리 가능)
 *
 * @returns {UseQueryResult<MessageGetResponse>} - 쿼리 결과 객체 (로딩 상태, 에러, 데이터 포함)
 *
 * @example
 * const { data, isLoading, error } = useGetMessages({ sceneId });
 *
 * @note
 * - 이 훅은 인증이 필요한 요청으로 authClient(Axios 인증 클라이언트)를 사용합니다.
 * - staleTime을 30초로 설정하여, 30초 동안 동일한 요청에 대해 캐시된 데이터를 사용합니다.
 * - refetchOnWindowFocus를 false로 설정하여 창이 다시 focus되어도 자동 재요청하지 않습니다.
 */
interface UseGetMessagesProps {
  sceneId: string;
  enabled?: boolean;
}

export const useGetMessages = ({
  sceneId,
  enabled = true,
}: UseGetMessagesProps) => {
  return useQuery<MessageGetResponse>({
    /**
     * 쿼리 키
     * - sceneId마다 개별적으로 캐싱되며, 동일한 sceneId는 캐시 재사용 가능
     */
    queryKey: ["messages", sceneId],

    /**
     * 비동기 쿼리 함수
     * - 서버로부터 메시지 리스트를 가져옴
     * - 인증된 Axios 인스턴스(authClient)를 사용하여 HTTP Only 쿠키 인증 처리
     */
    queryFn: async () => {
      const { data } = await authClient.get<MessageGetResponse>(`/messages`, {
        params: { scene: sceneId },
      });
      return data;
    },

    /**
     * 쿼리 활성화 여부
     * - sceneId가 유효하지 않으면 자동으로 쿼리 실행을 방지함
     */
    enabled: !!sceneId && enabled,

    /**
     * 데이터 신선도 유지 시간(ms)
     * - 30초 동안은 새 요청 없이 캐시된 데이터를 사용 (성능 최적화)
     */
    staleTime: 1000 * 30,

    /**
     * 창이 다시 focus 되었을 때 자동 재요청 여부
     * - false로 설정하여 UX 혼란 방지
     */
    refetchOnWindowFocus: false,
  });
};
