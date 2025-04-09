import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleGoalCompletion } from "@/api/goal";

export const useToggleGoalCompletion = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleGoalCompletion(id),
    onSuccess: () => {
      // 완료 상태 바뀌었으니 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["goals", memberId] });
    },
  });
};
