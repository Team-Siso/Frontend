import { useQuery } from "@tanstack/react-query";
import { fetchMemberProfile } from "../../api/member";

export const useMemberProfile = (memberId: string) => {
  return useQuery({
    queryKey: ["memberProfile", memberId],
    queryFn: () => fetchMemberProfile(memberId),
    enabled: !!memberId, // memberId가 존재할 때만 실행
  });
};
