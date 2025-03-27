import { create } from "zustand";

export interface Schedule {
  id: number;
  content: string;
  checkStatus: number;
  thisDay: string; // "YYYY-MM-DD" 형태
  startTime: string | null;
  endTime: string | null;
  completed: boolean;
}

interface ScheduleState {
  schedules: Schedule[];
  selectedDate: string;
  setSchedules: (schedules: Schedule[]) => void;
  setSelectedDate: (date: string) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  selectedDate: new Date().toISOString().split("T")[0],
  setSchedules: (schedules) => set({ schedules }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
