import { create } from "zustand";

export interface Member {
  id: number;
  email: string;
  nickName: string;
  introduce: string;
  profileUrl: string;
}

interface AuthState {
  email: string;
  password: string;
  confirmPassword: string;
  memberId: string | null;
  nickname: string;
  bio: string;
  profilePic: string;
  memberProfile: Member | null; // 추가
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setMemberId: (memberId: string) => void;
  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (profilePic: string) => void;
  setMemberProfile: (profile: Member | null) => void; // 추가
  resetState: () => void;
  signUp: () => Promise<string>;
  uploadImage: (file: File, memberId: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: "",
  password: "",
  confirmPassword: "",
  memberId: null,
  nickname: "",
  bio: "",
  profilePic: "",
  memberProfile: null, // 초기값 추가
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setMemberId: (memberId) => set({ memberId }),
  setNickname: (nickname) => set({ nickname }),
  setBio: (bio) => set({ bio }),
  setProfilePic: (profilePic) => set({ profilePic }),
  setMemberProfile: (profile) => set({ memberProfile: profile }), // 추가
  resetState: () =>
    set({
      email: "",
      password: "",
      confirmPassword: "",
      memberId: null,
      nickname: "",
      bio: "",
      profilePic: "",
      memberProfile: null,
    }),
  // src/store/auth/useAuthStore.ts (일부)
signUp: async () => {
    const { email, password, confirmPassword, bio, nickname, resetState, setMemberId } = get();
    // 서버 스펙에 맞게 필드명을 조정합니다.
    const formData = {
      email,
      password,
      confirmPassword,
      nickName: nickname,    // 만약 서버가 'nick_name'을 기대한다면 여기를 변경하세요.
      introduce: bio,        // 예: "introduce"
    };
  
    // 요청 전 payload 확인
    console.log("회원가입 요청 payload:", formData);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      // 응답 상태 확인
      console.log("회원가입 응답 상태:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("회원가입 오류 응답:", errorText);
        throw new Error("회원가입 실패");
      }
  
      const data = await response.json();
      console.log("회원가입 성공:", data);
      resetState();
      set({ memberId: data.id });
      localStorage.setItem("memberId", data.id.toString());
      return data.id.toString();
    } catch (error) {
      console.error("회원가입 에러 발생:", error);
      alert("회원가입 실패");
      throw error;
    }
  },
  
  uploadImage: async (file: File, memberId: string): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${memberId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image upload failed:", errorText);
        throw new Error("Image upload failed");
      }

      const text = await response.text();
      console.log("Profile picture update successful:", text);
      set((state) => ({
        memberProfile: state.memberProfile
          ? { ...state.memberProfile, profileUrl: text }
          : null,
      }));
      // 반환값 없이 종료 (void 반환)
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    const { resetState, setMemberId } = get();
    const params = new URLSearchParams({
      email,
      password,
    });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/login?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.status);
      if (!response.ok) {
        if (response.status === 404) {
          alert("아이디와 비밀번호를 확인해주세요!!");
        } else {
          alert("로그인에 실패했습니다.");
        }
        throw new Error("로그인 실패");
      }
      const data = await response.json();
      console.log("로그인 성공:", data);
      resetState();
      set({ memberId: data.id });
      localStorage.setItem("memberId", data.id.toString());
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
}));
