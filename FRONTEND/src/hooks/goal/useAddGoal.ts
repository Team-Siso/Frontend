import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGoal } from "@/api/goal";

export const useAddGoal = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => addGoal(memberId, title),
    onSuccess: () => {
      // 목표 추가 후 캐시 무효화 → 최신 목록 자동 반영
      queryClient.invalidateQueries({ queryKey: ["goals", memberId] });
    },
  });
};
