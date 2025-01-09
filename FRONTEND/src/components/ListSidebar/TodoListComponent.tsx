import { useState, useEffect } from "react";
import addTodoIcon from "@/assets/addTodoIcon.svg";
import addTimeTodoIcon from "@/assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

/** 날짜만 => 자정(KST) → UTC "같은 날짜"로 표시 */
function localMidnightToServerUtc(dateString: string) {
  const [yyyy, mm, dd] = dateString.split("-");
  const localDate = new Date(+yyyy, +mm - 1, +dd, 0, 0, 0);
  const offsetMs = localDate.getTimezoneOffset() * 60000;
  const corrected = new Date(localDate.getTime() - offsetMs);
  return corrected.toISOString(); 
}

/** 시/분 => UTC (실제 시간 변환) */
function localTimeToServerUtc(dateString: string, hour: number, minute: number) {
  const [yyyy, mm, dd] = dateString.split("-");
  const localDate = new Date(+yyyy, +mm - 1, +dd, hour, minute, 0);
  return localDate.toISOString();
}

/** 서버에서 받은 UTC를 로컬로 표시 ("오후 1시 20분" 등) */
function formatTime(utcString?: string | null) {
  if (!utcString) return "";
  const localString = utcString.replace("Z", ""); // 'Z' 제거
  const date = new Date(localString);
  let hh = date.getHours();
  const mm = date.getMinutes();

  const ampm = hh >= 12 ? "오후" : "오전";
  hh = hh % 12;
  if (hh === 0) hh = 12;

  return mm === 0
    ? `${ampm} ${hh}시`
    : `${ampm} ${hh}시 ${mm}분`;
}

const TodoListComponent = ({ className }) => {
  // ----------------------------
  // 투두 추가 관련 state
  // ----------------------------
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTimeTodo, setIsTimeTodo] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startHour, setStartHour] = useState("0");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("0");
  const [endMinute, setEndMinute] = useState("00");

  // ----------------------------
  // 인라인 수정 관련 state
  // ----------------------------
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editStartHour, setEditStartHour] = useState("0");
  const [editStartMinute, setEditStartMinute] = useState("00");
  const [editEndHour, setEditEndHour] = useState("0");
  const [editEndMinute, setEditEndMinute] = useState("00");

  // Hover 시 수정/삭제 버튼 노출
  const [showEditOptions, setShowEditOptions] = useState<number | null>(null);

  // ----------------------------
  // store (Zustand)
  // ----------------------------
  const memberId = useStore((s) => s.memberId);
  const schedules = useStore((s) => s.schedules);
  const selectedDate = useStore((s) => s.selectedDate);

  const fetchSchedulesByDate = useStore((s) => s.fetchSchedulesByDate);
  const addTodo = useStore((s) => s.addTodo);
  const setSchedules = useStore((s) => s.setSchedules);

  // ----------------------------
  // effect: 날짜 바뀌면 fetch
  // ----------------------------
  useEffect(() => {
    if (memberId && selectedDate) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchSchedulesByDate(memberId, selectedDate);
    }
  }, [memberId, selectedDate /*, fetchSchedulesByDate */]);

  useEffect(() => {
    console.log("[TodoList] schedules updated:", schedules);
  }, [schedules]);

  // ----------------------------
  // 투두 추가 (일반/시간)
  // ----------------------------
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
    if (!memberId || !selectedDate) return;
    if (!inputValue.trim()) return;
  
    const thisDayUtc = localMidnightToServerUtc(selectedDate);
  
    let newStartTime: string | null = null;
    let newEndTime: string | null = null;
    if (isTimeTodo) {
      newStartTime = localTimeToServerUtc(selectedDate, +startHour, +startMinute);
      newEndTime = localTimeToServerUtc(selectedDate, +endHour, +endMinute);
  
      // 시간 겹침 검사
      const newStart = new Date(newStartTime).getTime();
      const newEnd = new Date(newEndTime).getTime();
  
      const isOverlapping = schedules.some((todo) => {
        if (!todo.startTime || !todo.endTime) return false; // 시간 없는 투두는 제외
        const existingStart = new Date(todo.startTime).getTime();
        const existingEnd = new Date(todo.endTime).getTime();
        return (
          (newStart >= existingStart && newStart < existingEnd) || // 새 투두의 시작이 겹치는 경우
          (newEnd > existingStart && newEnd <= existingEnd) || // 새 투두의 끝이 겹치는 경우
          (newStart <= existingStart && newEnd >= existingEnd) // 새 투두가 기존 투두를 포함하는 경우
        );
      });
  
      if (isOverlapping) {
        alert("시간이 겹치는 투두가 이미 존재합니다. 다른 시간을 선택하세요.");
        return;
      }
    }
  
    const newTodo = {
      content: inputValue,
      checkStatus: 0,
      thisDay: thisDayUtc,
      startTime: newStartTime,
      endTime: newEndTime,
    };
  
    try {
      const response = await addTodo(memberId, newTodo);
      console.log("[handleAddTodo] addTodo response:", response);
      // 재조회
      await fetchSchedulesByDate(memberId, selectedDate);
  
      // 입력창 닫기
      setShowInput(false);
      setInputValue("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // ----------------------------
  // 체크박스 토글
  // ----------------------------
  const toggleTodoCompletion = async (todoId: number) => {
    const target = schedules.find((td) => td.id === todoId);
    if (!target) return;
    const updated = {
      ...target,
      checkStatus: target.checkStatus === 0 ? 1 : 0,
    };
    const res = await fetch(`https://siiso.site/api/v1/schedules/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setSchedules(schedules.map((td) => (td.id === todoId ? updated : td)));
    }
  };

  // ----------------------------
  // 삭제
  // ----------------------------
  const handleDelete = async (todoId: number) => {
    const res = await fetch(`https://siiso.site/api/v1/schedules/${todoId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSchedules(schedules.filter((td) => td.id !== todoId));
    }
  };

  // "인라인 수정" 시작
const startEditTodo = (todo) => {
  setEditId(todo.id);
  setEditContent(todo.content || "");

  // 시간 있는 투두라면, 기존 시작/완료 시간 파싱
  if (todo.startTime) {
    const sDate = new Date(todo.startTime.replace("Z", ""));
    setEditStartHour(String(sDate.getHours()));
    setEditStartMinute(String(sDate.getMinutes()).padStart(2, "0"));
  } else {
    setEditStartHour("0");
    setEditStartMinute("00");
  }

  if (todo.endTime) {
    const eDate = new Date(todo.endTime.replace("Z", ""));
    setEditEndHour(String(eDate.getHours()));
    setEditEndMinute(String(eDate.getMinutes()).padStart(2, "0"));
  } else {
    setEditEndHour("0");
    setEditEndMinute("00");
  }
};

  // ----------------------------
  // "인라인 수정" 저장 (PUT)
  // ----------------------------
  const handleEditSave = async (todoId: number) => {
    const target = schedules.find((td) => td.id === todoId);
    if (!target) return;

    // 기본: 이름은 항상 수정
    const updated: any = {
      ...target,
      content: editContent,
    };

    // 만약 시간 있는 투두라면 or 원래 없었어도 새로 시간을 넣으려면:
    // - 조건: startTime 또는 endTime이 존재하는 todo(혹은 사용자가 원래부터 시간 있는 todo만 수정 가능?) 
    // 여기서는 "시간 필드가 하나라도 있으면 => hasTime = true" 로 보겠습니다.
    const hasTime = !!(target.startTime || target.endTime);
    if (hasTime) {
      const newStartTime = localTimeToServerUtc(
        selectedDate,
        +editStartHour,
        +editStartMinute
      );
      const newEndTime = localTimeToServerUtc(
        selectedDate,
        +editEndHour,
        +editEndMinute
      );
      updated.startTime = newStartTime;
      updated.endTime = newEndTime;
    }

    try {
      const res = await fetch(`https://siiso.site/api/v1/schedules/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("투두 수정 실패");
      // 로컬 업데이트
      setSchedules(schedules.map((td) => (td.id === todoId ? updated : td)));
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // 정렬(무시간 → 시간 순)
  // ----------------------------
  const filteredTodos = schedules
    .filter((td) => td.thisDay?.split("T")[0] === selectedDate)
    .sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime < b.startTime ? -1 : 1;
    });

  // ----------------------------
  // 렌더
  // ----------------------------
  return (
    <div className={className}>
      {/* 헤더 */}
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
            alt="Add Time Todo"
            className="cursor-pointer"
            onClick={handleTimeIconClick}
          />
        </div>
      </div>

      {/* 입력창 (새 투두 추가) */}
      {showInput && (
        <div className="bg-gray-100 p-3 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
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

      {/* 시간 설정 (새 투두 생성 시) */}
      {isTimeTodo && showTimePicker && (
        <div className="bg-white p-3 m-3 border rounded space-y-2">
          <div>
            <label>시작:</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={String(h)}>
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
            <label>완료:</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={String(h)}>
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

      {/* 투두 목록 */}
      <ul className="divide-y mx-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => {
            const checked = todo.checkStatus === 1;
            const checkIcon = checked ? CheckedBoxIcon : UncheckBoxIcon;
            const displayTime = todo.startTime ? formatTime(todo.startTime) : "";

            // "시간이 있는 투두"인지 체크
            const hasTime = !!(todo.startTime || todo.endTime);

            // 현재 편집 중인 투두인가?
            const isEditing = editId === todo.id;

            return (
              <li
                key={todo.id}
                className="flex items-center py-3 pl-2 pr-2 relative"
                onMouseOver={() => setShowEditOptions(todo.id)}
                onMouseLeave={() => setShowEditOptions(null)}
              >
                {/* 체크박스 */}
                <img
                  src={checkIcon}
                  alt="check"
                  className="cursor-pointer"
                  onClick={() => toggleTodoCompletion(todo.id)}
                />

                {/* 인라인 수정 vs 평시 모드 */}
                {isEditing ? (
  <div className="ml-2 flex flex-col space-y-2">
    {/* 이름 수정 필드 */}
    <div>
      <label className="block text-sm font-medium">이름:</label>
      <input
        className="border p-1 w-full"
        type="text"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />
    </div>

    {/* (조건부) 시작 시간 수정 */}
    {hasTime && (
      <>
        <div>
          <label className="block text-sm font-medium">시작 시간:</label>
          <div className="flex items-center space-x-1">
            <select
              className="border p-1"
              value={editStartHour}
              onChange={(e) => setEditStartHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={String(h)}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              className="border p-1"
              value={editStartMinute}
              onChange={(e) => setEditStartMinute(e.target.value)}
            >
              {["00", "10", "20", "30", "40", "50"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 완료 시간 수정 */}
        <div>
          <label className="block text-sm font-medium">완료 시간:</label>
          <div className="flex items-center space-x-1">
            <select
              className="border p-1"
              value={editEndHour}
              onChange={(e) => setEditEndHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={String(h)}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              className="border p-1"
              value={editEndMinute}
              onChange={(e) => setEditEndMinute(e.target.value)}
            >
              {["00", "10", "20", "30", "40", "50"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    )}

    {/* 확인 버튼 */}
    <button
      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
      onClick={() => handleEditSave(todo.id)}
    >
      확인
    </button>
  </div>
) : (
  // 평시 (수정 X)
  <span className="ml-2">
    {todo.content}
    {displayTime && ` (${displayTime})`}
  </span>
)}

{showEditOptions === todo.id && (
  <div className="absolute right-0 top-0 rounded-lg">
    <button
      className="px-2 py-1 mr-2 border-b-2 border-r-2 border-gray-300 rounded-lg text-sm"
      onClick={() => startEditTodo(todo)}
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
            );
          })
        ) : (
          <li className="text-center py-3 text-gray-500">할 일이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default TodoListComponent;
