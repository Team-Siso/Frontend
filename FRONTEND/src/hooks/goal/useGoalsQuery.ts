// src/hooks/useGoalsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGoals } from "@/api/goal";

export const useGoalsQuery = (memberId?: string) => {
  return useQuery({
    queryKey: ["goals", memberId],
    queryFn: () => fetchGoals(memberId!),
    enabled: !!memberId, // memberId 있을 때만 fetch
  });
};
