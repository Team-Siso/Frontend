import { create } from "zustand";

interface FriendSearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useFriendSearchStore = create<FriendSearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
