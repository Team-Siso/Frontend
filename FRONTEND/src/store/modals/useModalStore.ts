import { create } from "zustand";

interface ModalState {
  isEditProfileOpen: boolean;
  isSignUpOpen: boolean;
  setEditProfileOpen: (open: boolean) => void;
  setSignUpOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isEditProfileOpen: false,
  isSignUpOpen: false,
  setEditProfileOpen: (open) => set({ isEditProfileOpen: open }),
  setSignUpOpen: (open) => set({ isSignUpOpen: open }),
}));
