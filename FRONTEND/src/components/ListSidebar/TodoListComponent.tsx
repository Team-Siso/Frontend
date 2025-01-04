import { useState, useEffect } from "react";
import addTodoIcon from "@/assets/addTodoIcon.svg";
import addTimeTodoIcon from "@/assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

const TodoListComponent = ({ className }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTimeTodo, setIsTimeTodo] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startHour, setStartHour] = useState("0");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("0");
  const [endMinute, setEndMinute] = useState("00");

  const memberId = useStore((state) => state.memberId);
  const schedules = useStore((state) => state.schedules);
  const selectedDate = useStore((state) => state.selectedDate);
  const fetchSchedulesByDate = useStore((state) => state.fetchSchedulesByDate);
  const addTodo = useStore((state) => state.addTodo);

  useEffect(() => {
    console.log("Member ID:", memberId);
    console.log("Selected Date:", selectedDate);
    // 페이지 로드 시 해당 날짜의 스케줄 불러오기
    if (memberId && selectedDate) {
      fetchSchedulesByDate(memberId, selectedDate);
    }
  }, [memberId, selectedDate, fetchSchedulesByDate]);

  const handleIconClick = () => {
    setShowInput(true);
    setIsTimeTodo(false);
    setShowTimePicker(false);
    setInputValue("");
  };

  const handleTimeIconClick = () => {
    setShowInput(true);
    setIsTimeTodo(true);
    setShowTimePicker(true);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = async () => {
    if (!memberId || !selectedDate) {
      console.error("Member ID 또는 Selected Date가 없습니다.");
      return;
    }

    if (!inputValue.trim()) {
      console.error("할 일 내용을 입력하세요.");
      return;
    }

    let newStartTime = null;
    let newEndTime = null;

    if (isTimeTodo) {
      const [yyyy, mm, dd] = selectedDate.split("-");
      const sH = parseInt(startHour, 10);
      const sM = parseInt(startMinute, 10);
      const eH = parseInt(endHour, 10);
      const eM = parseInt(endMinute, 10);

      const startDateObj = new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        sH,
        sM,
        0
      );
      const endDateObj = new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        eH,
        eM,
        0
      );

      newStartTime = startDateObj.toISOString();
      newEndTime = endDateObj.toISOString();
    }

    const newTodo = {
      content: inputValue,
      checkStatus: 0,
      thisDay: selectedDate, // 날짜는 "YYYY-MM-DD" 형식으로 저장
      startTime: newStartTime || null,
      endTime: newEndTime || null,
      completed: false,
    };

    try {
      await addTodo(memberId, newTodo); // 서버에 새 Todo 추가
      await fetchSchedulesByDate(memberId, selectedDate); // 새로 추가된 일정 포함해 다시 가져오기
      setShowInput(false);
      setInputValue("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const filteredTodos = schedules.filter((todo) => {
    const todoDate = todo.thisDay.split("T")[0]; // "2024-12-30T08:06:58.006" → "2024-12-30"
    return todoDate === selectedDate;
  });

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg font-bold pl-1">Todos</div>
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

      {showInput && (
        <div className="bg-gray-100 p-3 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => event.key === "Enter" && handleAddTodo()}
          />
          {isTimeTodo && (
            <button
              className="bg-blue-400 text-white px-3 py-1 rounded"
              onClick={() => setShowTimePicker(true)}
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

      {isTimeTodo && showTimePicker && (
        <div className="bg-white p-3 m-3 border rounded space-y-2">
          <div>
            <label>시작:</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
            >
              {["00", "10", "20", "30", "40", "50"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>종료:</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
            >
              {["00", "10", "20", "30", "40", "50"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setShowTimePicker(false)}
          >
            확인
          </button>
        </div>
      )}

      <ul className="divide-y mx-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <li key={todo.id} className="flex items-center py-3 pl-2 pr-2">
              <img
                src={todo.checkStatus === 1 ? CheckedBoxIcon : UncheckBoxIcon}
                alt="check"
                className="cursor-pointer"
              />
              <span className="ml-2">
                {todo.content}
                {todo.startTime && ` (${new Date(todo.startTime).toLocaleTimeString()})`}
              </span>
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
