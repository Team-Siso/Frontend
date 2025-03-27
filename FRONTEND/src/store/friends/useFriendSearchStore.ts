import { create } from "zustand";
import { Friend } from "../../api/friend";

interface FriendSearchState {
  searchTerm: string;
  friends: Friend[];
  setSearchTerm: (term: string) => void;
  setFriends: (friends: Friend[]) => void;
}

export const useFriendSearchStore = create<FriendSearchState>((set) => ({
  searchTerm: "",
  friends: [],
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFriends: (friends) => set({ friends }),
}));
