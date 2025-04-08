import { useQuery } from "@tanstack/react-query";
import { fetchSchedules } from "@/api/schedule";

export const useSchedulesQuery = (memberId?: string, date?: string) => {
  return useQuery({
    queryKey: ["schedules", memberId, date],
    queryFn: () => fetchSchedules(memberId!, date!),
    enabled: !!memberId && !!date,
  });
};
