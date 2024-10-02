import { useState, useEffect } from "react";
import addTodoIcon from "../../assets/addTodoIcon.svg";
import addTimeTodoIcon from "../../assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "../../assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "../../assets/CheckedBoxIcon.svg";
import { useStore } from "../../store";

const TodoListComponent = ({ className }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 입력 상자의 현재 값을 저장할 상태
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showEditOptions, setShowEditOptions] = useState(null); // 호버 중인 항목의 ID를 저장하는 상태
  const todos = useStore((state) => state.schedules) || []; // store에서 todos 가져오기
  const memberId = useStore((state) => state.memberId);
  const fetchSchedules = useStore((state) => state.fetchSchedules);
  const setSchedules = useStore((state) => state.setSchedules); // setSchedules를 올바르게 가져오기

  useEffect(() => {
    console.log("memberId:", memberId); // memberId를 로그로 출력

    if (memberId) {
      fetchSchedules(memberId)
        .then(() => {
          // fetchSchedules는 void를 반환하므로 별도 처리 불필요
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [memberId, fetchSchedules, setSchedules]);

  const handleIconClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (!memberId) {
      console.error("Error: memberI가 null 값입니다.");
      return;
    }

    if (inputValue.trim()) {
      console.log("저 여기 있어요");
      const newTodo = {
        content: inputValue,
        checkStatus: 0,
        thisDay: new Date().toISOString(),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      };

      try {
        const response = await fetch(`/api/v1/schedules/${memberId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.errorMessage);
          console.error("todo 추가 에러났어요, memberId는?", { memberId });

          return;
        }

        const data = await response.json();
        console.log("Response:", data);
        setSchedules([...todos, data]);
      } catch (error) {
        console.error("Error:", error);
      }

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
    setSchedules(updatedTodos);
  };

  const handleDelete = async (id) => {
    console.log("handleDelete 호출, id:", id);
    try {
      const response = await fetch(`/api/v1/schedules/${id}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      });

      if (response.ok) {
        console.log("삭제 성공");
        setSchedules(todos.filter((todo) => todo.id !== id));
      } else {
        console.error("삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startEdit = (id, title) => {
    setEditId(id);
    setEditText(title);
    setShowEditOptions(null); // 편집 시작 시, 편집 옵션 숨김
  };

  const handleEditChange = (event) => {
    setEditText(event.target.value);
  };

  const handleEditSave = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, content: editText };
      try {
        const response = await fetch(`/api/v1/schedules/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });

        if (response.ok) {
          console.log("수정 성공");
          setSchedules(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
          setEditId(null);
        } else {
          console.error("수정 실패:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className={`${className} `}>
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">Todos</div>
        <div className="flex items-center">
          <img src={addTodoIcon} alt="Add Todo" className="mr-2.5" onClick={handleIconClick} />
          <img src={addTimeTodoIcon} alt="Add Time to Todo" />
        </div>
      </div>
      {showInput && (
        <div className="">
          <input
            type="text"
            className="w-full p-3 pl-8 bg-grayEBEBEB"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => (event.key === "Enter" ? handleAddTodo() : null)}
          />
        </div>
      )}
      <ul className="divide-y divide-gray-300 mx-4">
        {todos.length > 0 ? (
          todos.map((todo) => (
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
                    onKeyPress={(event) => (event.key === "Enter" ? handleEditSave(todo.id) : null)}
                  />
                ) : (
                  todo.content
                )}
              </span>
              {showEditOptions === todo.id && (
                <div className="absolute right-0 top-0 rounded-lg">
                  <button
                    className="px-2 py-1 border-b-2 border-r-2 mr-2 border-gray-300 rounded-lg text-sm"
                    onClick={() => startEdit(todo.id, todo.content)}
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
          ))
        ) : (
          <li className="text-center py-3 text-gray-500">할 일이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default TodoListComponent;
