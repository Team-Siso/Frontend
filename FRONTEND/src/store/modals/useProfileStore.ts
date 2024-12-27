import { create } from "zustand";

interface ProfileState {
  nickname: string;
  setNickname: (nickname: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  profilePic: File | null;
  setProfilePic: (file: File | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  nickname: "",
  setNickname: (nickname) => set({ nickname }),
  bio: "",
  setBio: (bio) => set({ bio }),
  profilePic: null,
  setProfilePic: (file) => set({ profilePic: file }),
}));
