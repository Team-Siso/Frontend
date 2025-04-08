import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "@/api/schedule";

export const useAddSchedule = (memberId: string, date: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTodo: any) => addSchedule(memberId, newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", memberId, date] });
    },
  });
};
