import { create } from "zustand";

interface SignUpState {
  password: string;
  confirmPassword: string;
  nickname: string;
  bio: string;
  profilePic: string | null;
  file: File | null;

  isStep2Open: boolean; // Step2 모달 상태 추가
  setIsStep2Open: (isOpen: boolean) => void;

  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (profilePic: string | null) => void;
  setFile: (file: File | null) => void;
  handleProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  password: "",
  confirmPassword: "",
  nickname: "",
  bio: "",
  profilePic: null,
  file: null,
  isStep2Open: false, // 초기값 설정

  setIsStep2Open: (isOpen) => set({ isStep2Open: isOpen }),

  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setNickname: (nickname) => set({ nickname }),
  setBio: (bio) => set({ bio }),
  setProfilePic: (profilePic) => set({ profilePic }),
  setFile: (file) => set({ file }),

  handleProfilePicChange: (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set({ profilePic: reader.result as string, file: selectedFile });
      };
      reader.readAsDataURL(selectedFile);
    }
  },

  reset: () =>
    set({
      password: "",
      confirmPassword: "",
      nickname: "",
      bio: "",
      profilePic: null,
      file: null,
      isStep2Open: false,
    }),
}));
