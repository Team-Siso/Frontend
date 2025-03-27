import { useMutation } from "@tanstack/react-query";
import { updateMemberProfile } from "../../api/member";

export const useEditProfileMutation = () => {
  return useMutation<
    void,
    Error,
    { memberId: string; nickname: string; bio: string; profilePic?: File | null }
  >({
    mutationFn: ({ memberId, nickname, bio, profilePic }) =>
      updateMemberProfile({ memberId, nickname, bio, profilePic }),
  });
};
