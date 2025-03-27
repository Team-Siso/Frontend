import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { resetState, setMemberId } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      console.log("로그인 성공:", data);
      resetState();
      setMemberId(data.memberId);
      localStorage.setItem("memberId", data.memberId);
      navigate("/main");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    },
  });
};
