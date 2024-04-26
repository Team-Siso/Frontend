// todo list 목록들을 렌더링하는 컴포넌트 입니다.

// todo 제목
// 리스트를 추가하는 버튼 두 개(일정, todo)
// todolist 목록들
import React from "react";

const TodoListComponent = () => (
  <div className="todo-list-component">
    <h4>할 일 목록</h4>
    <ul>
      <li>React 공부하기</li>
      <li>컴포넌트 작성 연습</li>
    </ul>
  </div>
);

export default TodoListComponent;
