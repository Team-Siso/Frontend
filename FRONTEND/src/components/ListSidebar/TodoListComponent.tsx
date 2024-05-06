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
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showEditOptions, setShowEditOptions] = useState(null); // 호버 중인 항목의 ID를 저장하는 상태

  const handleIconClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: todos.length + 1,
        title: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      setShowInput(false);
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

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id, title) => {
    setEditId(id);
    setEditText(title);
    setShowEditOptions(null); // 편집 시작 시, 편집 옵션 숨김
  };

  const handleEditChange = (event) => {
    setEditText(event.target.value);
  };

  const handleEditSave = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, title: editText };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditId(null);
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
      <ul className="divide-y divide-gray-300 mx-4">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="flex items-center py-3 pl-2 pr-2 relative"
            onMouseOver={() => setShowEditOptions(todo.id)}
            onMouseLeave={() => setShowEditOptions(null)}
          >
            <img
              src={todo.completed ? CheckedBoxIcon : UncheckBoxIcon}
              alt={todo.completed ? "Todo completed" : "Mark todo as completed"}
              className="cursor-pointer"
              onClick={() => toggleTodoCompletion(todo.id)}
            />

            <span className={todo.completed ? "ml-2 line-through" : "ml-2"}>
              {todo.id === editId ? (
                <input
                  type="text"
                  value={editText}
                  onChange={handleEditChange}
                  onBlur={() => handleEditSave(todo.id)}
                />
              ) : (
                todo.title
              )}
            </span>
            {showEditOptions === todo.id && (
              <div className="absolute right-0 top-0 rounded-lg">
                <button
                  className="px-2 py-1 border-b-2 border-r-2 mr-2 border-gray-300 rounded-lg text-sm"
                  onClick={() => startEdit(todo.id, todo.title)}
                >
                  수정
                </button>
                <button
                  className="px-2 py-1 border-b-2 border-gray-300 rounded-lg text-sm"
                  onClick={() => handleDelete(todo.id)}
                >
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListComponent;
