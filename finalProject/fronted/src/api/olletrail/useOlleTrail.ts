import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOlleOverrides, saveOlleOverride, deleteOlleOverride } from "./olleTrailAPI";
import type { OlleTrailOverride } from "./olleTrailAPI";
import { olleTrails } from "../../data/olleTrails";

/** override 조회 후 정적 olleTrails 데이터와 병합 */
export const useOlleTrails = () => {
  return useQuery({
    queryKey: ["olleTrails", "overrides"],
    queryFn: async () => {
      try {
        const res = await getOlleOverrides();
        if (!res.success) return olleTrails;

        const overrideMap: Record<number, OlleTrailOverride> = {};
        res.list.forEach((ov) => { overrideMap[ov.trailId] = ov; });

        return olleTrails.map((trail) => {
          const ov = overrideMap[trail.id];
          if (!ov) return trail;
          return {
            ...trail,
            ...(ov.subtitle    !== undefined && { subtitle:    ov.subtitle    }),
            ...(ov.description !== undefined && { description: ov.description }),
            ...(ov.difficulty  !== undefined && { difficulty:  ov.difficulty  }),
            ...(ov.duration    !== undefined && { duration:    ov.duration    }),
            ...(ov.terrain     !== undefined && { terrain:     ov.terrain     }),
            ...(ov.distance    !== undefined && { distance:    ov.distance    }),
          };
        });
      } catch {
        // 백엔드 미연결 시 정적 데이터로 폴백
        return olleTrails;
      }
    },
    initialData: olleTrails as any,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
};

/** 관리자용 — 원본 override 목록 */
export const useOlleOverrides = () => {
  return useQuery({
    queryKey: ["olleTrails", "overrides", "raw"],
    queryFn: getOlleOverrides,
  });
};

/** override 저장 */
export const useSaveOlleOverride = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      trailId,
      data,
    }: {
      trailId: number;
      data: Omit<OlleTrailOverride, "trailId" | "updatedAt" | "updatedBy">;
    }) => saveOlleOverride(trailId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["olleTrails"] });
    },
  });
};

/** override 삭제 */
export const useDeleteOlleOverride = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trailId: number) => deleteOlleOverride(trailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["olleTrails"] });
    },
  });
};
