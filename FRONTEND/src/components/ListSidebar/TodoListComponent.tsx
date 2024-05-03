// todo list 목록들을 렌더링하는 컴포넌트 입니다.

// todo 제목
// 리스트를 추가하는 버튼 두 개(일정, todo)
// todolist 목록들
import React from "react";
import addTodoIcon from "../../assets/addTodoIcon.svg";
import addTimeTodoIcon from "../../assets/addTimeTodoIcon.svg";

const TodoListComponent = () => (
  <div className="todo-list-component">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between", // 좌우 끝에 요소들을 배치
        alignItems: "center", // 세로 방향 중앙 정렬
        padding: "10px", // 패딩을 추가하여 레이아웃에 여유를 줍니다.
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>Todos</div>
      <div>
        <img src={addTodoIcon} alt="Add Todo" style={{ marginRight: "10px" }} />
        <img src={addTimeTodoIcon} alt="Add Time to Todo" />
      </div>
    </div>
    <h4>할 일 목록</h4>
    <ul>
      <li>React 공부하기</li>
      <li>컴포넌트 작성 연습</li>
    </ul>
  </div>
);

export default TodoListComponent;
