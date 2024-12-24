import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/ListSidebar/todoList";

export const useTodoList = (memberId: string) => {
  const queryClient = useQueryClient();

  // Fetch todos
  const todosQuery = useQuery(["todos", memberId], () => fetchTodos(memberId), {
    enabled: !!memberId, // memberId가 있을 때만 실행
  });

  // Add todo
  const addTodoMutation = useMutation((newTodo: any) => addTodo(memberId, newTodo), {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", memberId]); // 캐시 무효화 후 리패치
    },
  });

  // Update todo
  const updateTodoMutation = useMutation(
    ({ id, updatedTodo }: { id: string; updatedTodo: any }) => updateTodo(id, updatedTodo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["todos", memberId]); // 캐시 무효화 후 리패치
      },
    }
  );

  // Delete todo
  const deleteTodoMutation = useMutation((id: string) => deleteTodo(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", memberId]); // 캐시 무효화 후 리패치
    },
  });

  return {
    todosQuery,
    addTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
  };
};
