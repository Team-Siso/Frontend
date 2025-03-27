import { useQuery } from "@tanstack/react-query";
import { fetchSchedules } from "../../api/schedule";
import { Schedule } from "../../store/scheduleStore";

export const useSchedules = (memberId: string) => {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedules", memberId],
    queryFn: () => fetchSchedules(memberId),
    enabled: !!memberId,
  });
};
