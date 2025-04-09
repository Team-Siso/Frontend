import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGoal } from "@/api/goal";

export const useUpdateGoal = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title, progress }: { id: number; title: string; progress: number }) =>
      updateGoal(id, title, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", memberId] });
    },
  });
};
