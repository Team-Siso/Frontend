import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGoal } from "@/api/goal";

export const useDeleteGoal = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", memberId] });
    },
  });
};
