const BASE_URL = "/api/v1/schedules";

// Fetch Todo 리스트
export const fetchTodos = async (memberId: string): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/${memberId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.statusText}`);
  }
  return response.json(); // 서버에서 받은 데이터를 반환
};

// Todo 추가
export const addTodo = async (memberId: string, newTodo: any): Promise<any> => {
  const response = await fetch(`${BASE_URL}/${memberId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to add todo: ${errorData?.message || response.statusText}`);
  }
  return response.json();
};

// Todo 수정
export const updateTodo = async (id: string, updatedTodo: any): Promise<any> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update todo: ${errorData?.message || response.statusText}`);
  }
  return response.json();
};

// Todo 삭제
export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to delete todo: ${errorData?.message || response.statusText}`);
  }
};
