import { useState, useEffect } from "react";
import addTodoIcon from "@/assets/addTodoIcon.svg";
import addTimeTodoIcon from "@/assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

const TodoListComponent = ({ className }) => {
  // ---------------------------
  // 공통 State
  // ---------------------------
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // "Add Time to Todo" 인지 여부 (새 Todo 추가 시)
  const [isTimeTodo, setIsTimeTodo] = useState(false);
  // 새로 Todo 추가 시 시간 설정 창 보이기 여부
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 새 Todo 추가 시 시간 선택
  const [startHour, setStartHour] = useState("0");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("0");
  const [endMinute, setEndMinute] = useState("00");

  // ---------------------------
  // 편집(수정) 관련 State
  // ---------------------------
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  // 편집 중 마우스 hover 시 버튼 뜨는 용도
  const [showEditOptions, setShowEditOptions] = useState(null);

  // **편집 시 시간 설정**  
  const [editTimePicker, setEditTimePicker] = useState(false); // 편집 중 시간 설정 창 보이기
  const [editStartHour, setEditStartHour] = useState("0");
  const [editStartMinute, setEditStartMinute] = useState("00");
  const [editEndHour, setEditEndHour] = useState("0");
  const [editEndMinute, setEditEndMinute] = useState("00");

  // ---------------------------
  // Store
  // ---------------------------
  const todos = useStore((state) => state.schedules) || [];
  const memberId = useStore((state) => state.memberId);
  const fetchSchedules = useStore((state) => state.fetchSchedules);
  const setSchedules = useStore((state) => state.setSchedules);

  // ---------------------------
  // 초기 데이터 fetch
  // ---------------------------
  useEffect(() => {
    console.log("memberId:", memberId);
    console.log("Updated Schedules:", todos);

    if (memberId) {
      fetchSchedules(memberId)
        .then(() => {})
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [memberId, fetchSchedules, setSchedules]);

  // 상태 변경 로그
  useEffect(() => {
    console.log("Todo 변경 감지:", todos);
  }, [todos]);

  // ---------------------------
  // "Add Todo" 버튼 클릭
  // ---------------------------
  const handleIconClick = () => {
    setShowInput(true);
    setIsTimeTodo(false);
    setShowTimePicker(false);
    setInputValue("");

    // 혹시 이전에 남아있을 수 있는 값 초기화
    setStartHour("0");
    setStartMinute("00");
    setEndHour("0");
    setEndMinute("00");
  };

  // ---------------------------
  // "Add Time to Todo" 버튼 클릭
  // ---------------------------
  const handleTimeIconClick = () => {
    setShowInput(true);
    setIsTimeTodo(true);
    setShowTimePicker(true);
    setInputValue("");

    // 혹시 이전에 남아있을 수 있는 값 초기화
    setStartHour("0");
    setStartMinute("00");
    setEndHour("0");
    setEndMinute("00");
  };

  // ---------------------------
  // 입력창 변경
  // ---------------------------
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // ---------------------------
  // 새 Todo: 시간 설정 창 토글
  // ---------------------------
  const handleTimeButtonClick = () => {
    setShowTimePicker((prev) => !prev);
  };

  // 새 Todo: 시간 설정 창에서 "확인"
  const handleConfirmTime = () => {
    setShowTimePicker(false);
  };

  // ---------------------------
  // 새 Todo 생성
  // ---------------------------
  const handleAddTodo = async () => {
    if (!memberId) {
      console.error("Error: memberId가 null 값입니다.");
      return;
    }

    if (!inputValue.trim()) return;

    let newStartTime = null;
    let newEndTime = null;

    if (isTimeTodo) {
      const now = new Date();
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(startHour),
        parseInt(startMinute),
        0,
        0
      );
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(endHour),
        parseInt(endMinute),
        0,
        0
      );
      newStartTime = startDate.toISOString();
      newEndTime = endDate.toISOString();
    }

    const newTodo = {
      content: inputValue,
      checkStatus: 0,
      completed: false,
      thisDay: new Date().toISOString(),
      startTime: newStartTime,
      endTime: newEndTime,
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
  };

  // ---------------------------
  // 체크박스 클릭 (완료 토글)
  // ---------------------------
  const toggleTodoCompletion = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = {
        ...todo,
        checkStatus: todo.checkStatus === 0 ? 1 : 0,
      };

      try {
        const response = await fetch(`/api/v1/schedules/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });

        if (response.ok) {
          console.log("checkStatus 업데이트 성공:", updatedTodo);
          setSchedules(todos.map((t) => (t.id === id ? updatedTodo : t)));
          setEditId(null);
        } else {
          console.error("checkStatus 업데이트 실패:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // ---------------------------
  // 삭제
  // ---------------------------
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

  // ---------------------------
  // 수정 시작
  // ---------------------------
  const startEdit = (id, title, startTime, endTime) => {
    setEditId(id);
    setEditText(title);
    setShowEditOptions(null);

    // 편집용 시간 설정 초기화
    if (startTime) {
      // startTime이 있으면 Date로 파싱
      const sTime = new Date(startTime);
      setEditStartHour(sTime.getHours().toString());   // "0" ~ "23"
      setEditStartMinute(sTime.getMinutes().toString().padStart(2, "0")); // "00", "10", "30" 등
    } else {
      // startTime이 없으면 기본값
      setEditStartHour("0");
      setEditStartMinute("00");
    }

    if (endTime) {
      const eTime = new Date(endTime);
      setEditEndHour(eTime.getHours().toString());
      setEditEndMinute(eTime.getMinutes().toString().padStart(2, "0"));
    } else {
      setEditEndHour("0");
      setEditEndMinute("00");
    }

    setEditTimePicker(false); // 처음엔 시간설정창 닫힘
  };

  // ---------------------------
  // 수정 중 텍스트 변경
  // ---------------------------
  const handleEditChange = (event) => {
    setEditText(event.target.value);
  };

  // ---------------------------
  // 수정 중 시간 설정 창 토글
  // ---------------------------
  const toggleEditTimePicker = () => {
    setEditTimePicker((prev) => !prev);
  };

  // ---------------------------
  // 수정 중 시간 설정 창에서 "확인"
  // ---------------------------
  const handleEditTimeConfirm = () => {
    setEditTimePicker(false);
  };

  // ---------------------------
  // 수정 저장
  // ---------------------------
  const handleEditSave = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    // 수정된 todo 만들기
    const updatedTodo = { ...todo, content: editText };

    // 편집창에서 선택한 시간 -> ISO
    // (만약 기존에 시간 없었어도, 편집에서 시간을 추가할 수 있음)
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(editStartHour),
      parseInt(editStartMinute),
      0,
      0
    );
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(editEndHour),
      parseInt(editEndMinute),
      0,
      0
    );

    updatedTodo.startTime = startDate.toISOString();
    updatedTodo.endTime = endDate.toISOString();

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
        setSchedules(todos.map((t) => (t.id === id ? updatedTodo : t)));
        setEditId(null);
      } else {
        console.error("수정 실패:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ---------------------------
  // 시/분 select 옵션
  // ---------------------------
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = ["00", "10", "20", "30", "40", "50"];

  return (
    <div className={`${className} `}>
      {/* 상단: Add Todo / Add Time to Todo */}
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">Todos</div>
        <div className="flex items-center">
          <img
            src={addTodoIcon}
            alt="Add Todo"
            className="mr-2.5 cursor-pointer"
            onClick={handleIconClick}
          />
          <img
            src={addTimeTodoIcon}
            alt="Add Time to Todo"
            className="cursor-pointer"
            onClick={handleTimeIconClick}
          />
        </div>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: "calc(43vh - 60px - 40px)", // 부모 높이에서 텍스트 영역과 입력 영역 제외
          flexGrow: 1, // 나머지 공간을 차지하도록 설정
        }}
      >
  

      {/* 새 Todo 입력창 */}
      {showInput && (
        <div className="bg-grayEBEBEB p-3 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => (event.key === "Enter" ? handleAddTodo() : null)}
          />
          {/* isTimeTodo일 때만 시간 설정 버튼 */}
          {isTimeTodo && (
            <button
              className="bg-blue-400 text-white px-3 py-1 rounded"
              onClick={handleTimeButtonClick}
            >
              시간 설정
            </button>
          )}
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleAddTodo}
          >
            추가
          </button>
        </div>
      )}

      {/* 새 Todo: 시간 설정창 */}
      {isTimeTodo && showTimePicker && (
        <div className="bg-white shadow-md p-3 m-3 border rounded space-y-2">
          <div className="flex items-center space-x-2">
            <label>시작시간:</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="border p-1"
            >
              {hours.map((h) => (
                <option key={`start-h-${h}`} value={h}>
                  {h.padStart(2, "0")}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
              className="border p-1"
            >
              {minutes.map((m) => (
                <option key={`start-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label>종료시간:</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="border p-1"
            >
              {hours.map((h) => (
                <option key={`end-h-${h}`} value={h}>
                  {h.padStart(2, "0")}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
              className="border p-1"
            >
              {minutes.map((m) => (
                <option key={`end-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleConfirmTime}
          >
            확인
          </button>
        </div>
      )}

      {/* Todo 목록 */}
      <ul className="divide-y divide-gray-300 mx-4">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center py-3 pl-2 pr-2 relative"
              onMouseOver={() => setShowEditOptions(todo.id)}
              onMouseLeave={() => setShowEditOptions(null)}
            >
              {/* 체크박스 */}
              <img
                src={todo.checkStatus === 1 ? CheckedBoxIcon : UncheckBoxIcon}
                alt={todo.checkStatus === 1 ? "Todo completed" : "Mark todo as completed"}
                className="cursor-pointer"
                onClick={() => toggleTodoCompletion(todo.id)}
              />

              {/* 편집 중인지 여부에 따른 UI */}
              {todo.id === editId ? (
                <div className="flex flex-col ml-2 flex-1">
                  {/* 텍스트 Input */}
                  <input
                    className="p-1 border-b mb-1"
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleEditSave(todo.id);
                      }
                    }}
                  />

                  {/* "시간 설정" 버튼 -> toggleEditTimePicker */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-400 text-white px-2 py-1 rounded"
                      onClick={toggleEditTimePicker}
                    >
                      시간 설정
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditSave(todo.id)}
                    >
                      저장
                    </button>
                  </div>

                  {/* 편집 중 시간설정창 */}
                  {editTimePicker && (
                    <div className="bg-white shadow-md p-3 mt-2 border rounded space-y-2">
                      <div className="flex items-center space-x-2">
                        <label>시작시간:</label>
                        <select
                          value={editStartHour}
                          onChange={(e) => setEditStartHour(e.target.value)}
                          className="border p-1"
                        >
                          {hours.map((h) => (
                            <option key={`edit-start-h-${h}`} value={h}>
                              {h.padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span>:</span>
                        <select
                          value={editStartMinute}
                          onChange={(e) => setEditStartMinute(e.target.value)}
                          className="border p-1"
                        >
                          {minutes.map((m) => (
                            <option key={`edit-start-m-${m}`} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label>종료시간:</label>
                        <select
                          value={editEndHour}
                          onChange={(e) => setEditEndHour(e.target.value)}
                          className="border p-1"
                        >
                          {hours.map((h) => (
                            <option key={`edit-end-h-${h}`} value={h}>
                              {h.padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span>:</span>
                        <select
                          value={editEndMinute}
                          onChange={(e) => setEditEndMinute(e.target.value)}
                          className="border p-1"
                        >
                          {minutes.map((m) => (
                            <option key={`edit-end-m-${m}`} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={handleEditTimeConfirm}
                      >
                        확인
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // 편집 중이 아니면 그냥 표시
                <>
                  <span
                    className={
                      todo.checkStatus === 1 ? "ml-2 line-through" : "ml-2"
                    }
                  >
                    {todo.content}
                  </span>

                  {/* 시간 표시 (startTime만 표시) */}
                  {todo.startTime && (
                    <span className="ml-auto text-sm text-gray-600">
                      {new Date(todo.startTime)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(todo.startTime)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  )}
                </>
              )}

              {/* 우측 상단 수정/삭제 버튼 */}
              {showEditOptions === todo.id && todo.id !== editId && (
                <div className="absolute right-0 top-0 rounded-lg bg-white p-1 shadow-md">
                  <button
                    className="px-2 py-1 border-b-2 border-r-2 mr-2 border-gray-300 rounded-lg text-sm"
                    onClick={() => startEdit(todo.id, todo.content, todo.startTime, todo.endTime)}
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
    </div>
  );
};

export default TodoListComponent;
