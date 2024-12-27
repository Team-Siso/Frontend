import { create } from "zustand";

interface AuthState {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  memberId: string | null; // 로그인된 사용자 ID
  setMemberId: (id: string) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
  password: "",
  setPassword: (password) => set({ password }),
  memberId: null, // 초기값은 null
  setMemberId: (id) => set({ memberId: id }),
  resetAuth: () => set({ email: "", password: "", memberId: null }), // 상태 초기화
}));
