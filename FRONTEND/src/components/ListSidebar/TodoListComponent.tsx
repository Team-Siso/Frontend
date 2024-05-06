// todo list 목록들을 렌더링하는 컴포넌트 입니다.
// 오늘 날짜
// todo 제목
// 리스트를 추가하는 버튼 두 개(일정, todo)
// todolist 목록들
import React, { useState } from "react";
import addTodoIcon from "../../assets/addTodoIcon.svg";
import addTimeTodoIcon from "../../assets/addTimeTodoIcon.svg";

interface Todo {
  id: number;
  task: string;
  isCompleted: boolean;
  time?: string; // 시간은 선택적
}

const TodoListComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className} bg-blue-100`}>
      <div className="flex justify-between items-center p-2.5">
        {" "}
        <div className="text-2xl font-bold">Todos</div>{" "}
        <div className="flex items-center">
          <img src={addTodoIcon} alt="Add Todo" className="mr-2.5" />{" "}
          <img src={addTimeTodoIcon} alt="Add Time to Todo" />
        </div>
      </div>
    </div>
  );
};

export default TodoListComponent;
