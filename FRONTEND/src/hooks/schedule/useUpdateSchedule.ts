import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSchedule } from "@/api/schedule";

export const useUpdateSchedule = (memberId: string, date: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, updated }: { todoId: number; updated: any }) =>
      updateSchedule(todoId, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", memberId, date] });
    },
  });
};
