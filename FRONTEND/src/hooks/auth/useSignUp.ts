import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../api/auth";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      confirmPassword,
      nickname,
      bio,
    }: {
      email: string;
      password: string;
      confirmPassword: string;
      nickname: string;
      bio: string;
    }) => signUp({ email, password, confirmPassword, nickname, bio }),
    onSuccess: (data) => {
      console.log("회원가입 성공:", data);
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    },
  });
};
