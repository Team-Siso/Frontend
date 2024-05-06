// todo list 목록들을 렌더링하는 컴포넌트 입니다.
// 오늘 날짜
// todo 제목
// 리스트를 추가하는 버튼 두 개(일정, todo)
// todolist 목록들
import React, { useState } from "react";
import addTodoIcon from "../../assets/addTodoIcon.svg";
import addTimeTodoIcon from "../../assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "../../assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "../../assets/CheckedBoxIcon.svg";

const TodoListComponent = ({ className }) => {
  const [showInput, setShowInput] = useState(false);
  const [todos, setTodos] = useState([]); // 할 일 목록을 저장할 상태
  const [inputValue, setInputValue] = useState(""); // 입력 상자의 현재 값을 저장할 상태

  const handleIconClick = () => {
    setShowInput(true); // 입력 상자를 표시
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // 입력창의 값이 변경될 때마다 상태 업데이트
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: todos.length + 1, // 간단한 ID 생성
        title: inputValue,
        completed: false, // 완료 상태 초기값
      };
      setTodos([...todos, newTodo]); // 새 할 일을 목록에 추가
      setInputValue(""); // 입력창 초기화
      setShowInput(false); // 입력창 숨기기
    }
  };

  const toggleTodoCompletion = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <div className={`${className} `}>
      <div className="flex justify-between items-center p-2.5">
        {" "}
        <div className="text-lg text-gray585151 font-bold pl-1">Todos</div>{" "}
        <div className="flex items-center">
          <img src={addTodoIcon} alt="Add Todo" className="mr-2.5" onClick={handleIconClick} />{" "}
          <img src={addTimeTodoIcon} alt="Add Time to Todo" />
        </div>
      </div>
      {/* 입력 상자가 보여야 하는 경우에만 렌더링 */}
      {showInput && (
        <div className="">
          {/* 사용자 입력을 받는 텍스트 필드 */}
          <input
            type="text"
            className="w-full p-3 pl-8 bg-grayEBEBEB"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(event) => (event.key === "Enter" ? handleAddTodo() : null)}
          />
        </div>
      )}
      {/* 할 일 목록을 나열 */}
      <ul className="mx-4">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={`flex items-center py-3 pl-2 pr-2 ${index < todos.length - 1 ? "border-b border-gray-300" : ""}`}
          >
            <img
              src={todo.completed ? CheckedBoxIcon : UncheckBoxIcon}
              alt={todo.completed ? "Todo completed" : "Mark todo as completed"}
              className="cursor-pointer"
              onClick={() => toggleTodoCompletion(todo.id)}
            />
            <span className={todo.completed ? "ml-2" : "ml-2"}>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListComponent;
