// import axios from "axios";
// import { Schedule } from "../store/scheduleStore";

// export const fetchSchedules = async (memberId: string): Promise<Schedule[]> => {
//   const response = await axios.get(`${import.meta.env.VITE_API_URL}/schedules/${memberId}`);
//   if (response.status !== 200) {
//     throw new Error("Failed to fetch schedules");
//   }
//   return response.data;
// };

// schedules 관련 fetch 함수들만 모은 파일

export const fetchSchedules = async (memberId: string, date: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${memberId}/${date}`);
  if (!res.ok) throw new Error("일정 불러오기 실패");
  return res.json();
};

export const addSchedule = async (memberId: string, newTodo: any) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${memberId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  if (!res.ok) throw new Error("일정 추가 실패");
  return res.json();
};

export const updateSchedule = async (todoId: number, updated: any) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error("일정 수정 실패");
  return res.json();
};

export const deleteSchedule = async (todoId: number) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${todoId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("일정 삭제 실패");
  return true;
};
