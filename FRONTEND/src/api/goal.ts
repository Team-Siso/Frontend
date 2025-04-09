// src/api/goals.ts
export const fetchGoals = async (memberId: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/goals/${memberId}`);
  if (!res.ok) throw new Error("목표 목록을 불러오는 데 실패했습니다.");
  return res.json();
};

export const addGoal = async (memberId: string, title: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/goals/${memberId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("목표 추가 실패");
  return res.json();
};

export const updateGoal = async (id: number, title: string, progress: number) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/goals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, progress }),
  });
  if (!res.ok) throw new Error("목표 수정 실패");
  return res.json();
};

export const toggleGoalCompletion = async (id: number) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/goals/toggle/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("목표 완료 상태 토글 실패");
  return res.json();
};

export const deleteGoal = async (id: number) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/goals/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("목표 삭제 실패");
  return true;
};
