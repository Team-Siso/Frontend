import { create } from "zustand";

interface SettingsState {
  fixedNotifications: boolean;
  friendAddNotifications: boolean;
  setFixedNotifications: (value: boolean) => void;
  setFriendAddNotifications: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  fixedNotifications: false,
  friendAddNotifications: false,
  setFixedNotifications: (value) => set({ fixedNotifications: value }),
  setFriendAddNotifications: (value) => set({ friendAddNotifications: value }),
}));
