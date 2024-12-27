import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";

export const useLogin = (
  onSuccess: (data: { id: number; email: string }) => void,
  onError: (error: any) => void
) => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess,
    onError,
  });
};
