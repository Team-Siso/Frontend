import axios from "axios";
import { Schedule } from "../store/scheduleStore";

export const fetchSchedules = async (memberId: string): Promise<Schedule[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/schedules/${memberId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch schedules");
  }
  return response.data;
};
