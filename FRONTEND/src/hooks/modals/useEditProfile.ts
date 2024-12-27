import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMemberProfile, updateMemberProfile } from "../../api/member";
import { UpdateProfilePayload } from "../../api/member";

export const useFetchMemberProfile = (memberId: string) => {
  return useQuery({
    queryKey: ["memberProfile", memberId],
    queryFn: () => fetchMemberProfile(memberId),
    enabled: !!memberId, // memberId가 있을 때만 요청
  });
};

export const useUpdateMemberProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateProfilePayload>({
    mutationFn: updateMemberProfile,
    onSuccess: (_, variables) => {
      // queryKey를 명시적으로 설정
      queryClient.invalidateQueries({
        queryKey: ["memberProfile", variables.memberId],
      });
    },
  });
};
