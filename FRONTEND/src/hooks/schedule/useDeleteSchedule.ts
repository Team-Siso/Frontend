import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "@/api/schedule";

export const useDeleteSchedule = (memberId: string, date: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todoId: number) => deleteSchedule(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", memberId, date] });
    },
  });
};
