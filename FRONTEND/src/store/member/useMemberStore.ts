import { create } from "zustand";

interface MemberState {
  memberId: number | null;
  setMemberId: (id: number) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  memberId: null,
  setMemberId: (id: number) => set({ memberId: id }),
}));
