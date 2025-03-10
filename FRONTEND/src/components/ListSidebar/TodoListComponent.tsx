import { useState, useEffect } from "react";
import addTodoIcon from "@/assets/addTodoIcon.svg";
import addTimeTodoIcon from "@/assets/addTimeTodoIcon.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

// 시/분 => 서버 UTC 변환
function localTimeToServerUtc(dateString, hour, minute) {
  const [yyyy, mm, dd] = dateString.split("-");
  const localDate = new Date(+yyyy, +mm - 1, +dd, hour, minute, 0);
  return localDate.toISOString();
}

// 서버 UTC -> "오전/오후 HH시 mm분"
function formatTime(utcString) {
  if (!utcString) return "";
  const date = new Date(utcString);
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
  // 입력창 열림/닫힘
  const [showInput, setShowInput] = useState(false);
  // 입력창 내용
  const [inputValue, setInputValue] = useState("");
  // 시간 있는 투두인가?
  const [isTimeTodo, setIsTimeTodo] = useState(false);
  // 시간 선택창 열림/닫힘
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 시간 필드
  const [startHour, setStartHour] = useState("0");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("0");
  const [endMinute, setEndMinute] = useState("00");

  // 편집 관련
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editStartHour, setEditStartHour] = useState("0");
  const [editStartMinute, setEditStartMinute] = useState("00");
  const [editEndHour, setEditEndHour] = useState("0");
  const [editEndMinute, setEditEndMinute] = useState("00");
  const [showEditOptions, setShowEditOptions] = useState(null);

  // store
  const memberId = useStore((s) => s.memberId);
  const schedules = useStore((s) => s.schedules);
  const selectedDate = useStore((s) => s.selectedDate);
  const openAddTodo = useStore((s) => s.openAddTodo);
  const setOpenAddTodo = useStore((s) => s.setOpenAddTodo);
  const fetchSchedulesByDate = useStore((s) => s.fetchSchedulesByDate);
  const setSchedules = useStore((s) => s.setSchedules);

  // 날짜 변경 시 => fetch
  useEffect(() => {
    if (memberId && selectedDate) {
      fetchSchedulesByDate(memberId, selectedDate);
    }
  }, [memberId, selectedDate, fetchSchedulesByDate]);

  useEffect(() => {
    console.log("[TodoList] schedules updated:", schedules);
  }, [schedules]);

  // store에서 "openAddTodo"를 통해 입력창 열기 가능
  useEffect(() => {
    if (openAddTodo) {
      // 항상 "일반 투두 모드"로 열기
      setShowInput(true);
      setIsTimeTodo(false);
      setShowTimePicker(false);
      setInputValue("");
      // 시간 필드 초기화
      setStartHour("0");
      setStartMinute("00");
      setEndHour("0");
      setEndMinute("00");
      setOpenAddTodo(false);
    }
  }, [openAddTodo, setOpenAddTodo]);

  // 아이콘 클릭 (일반 스케줄)
  const handleIconClick = () => {
    // 만약 이미 "일반 투두" 상태로 열려 있으면 => 닫기
    if (showInput && !isTimeTodo) {
      setShowInput(false);
      return;
    }
    // 아니면 열기 (일반 모드)
    setShowInput(true);
    setIsTimeTodo(false);
    setShowTimePicker(false);
    setInputValue("");
    setStartHour("0");
    setStartMinute("00");
    setEndHour("0");
    setEndMinute("00");
  };

  // 아이콘 클릭 (시간 있는 스케줄)
  const handleTimeIconClick = () => {
    // 만약 이미 "시간 투두" 상태로 열려 있으면 => 닫기
    if (showInput && isTimeTodo) {
      setShowInput(false);
      return;
    }
    // 아니면 열기 (시간 모드)
    setShowInput(true);
    setIsTimeTodo(true);
    setShowTimePicker(true);
    setInputValue("");
    setStartHour("0");
    setStartMinute("00");
    setEndHour("0");
    setEndMinute("00");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 새 스케줄 추가
  const handleAddTodo = async () => {
    if (!memberId || !selectedDate) return;
    if (!inputValue.trim()) return;

    let newStartTime = null;
    let newEndTime = null;
    if (isTimeTodo) {
      newStartTime = localTimeToServerUtc(selectedDate, +startHour, +startMinute);
      newEndTime   = localTimeToServerUtc(selectedDate, +endHour, +endMinute);

      // 시간 겹침 검사
      const newSt = new Date(newStartTime).getTime();
      const newEt = new Date(newEndTime).getTime();
      const overlapping = schedules.some((todo) => {
        if (!todo.startTime || !todo.endTime) return false;
        const exSt = new Date(todo.startTime).getTime();
        const exEt = new Date(todo.endTime).getTime();
        return (
          (newSt >= exSt && newSt < exEt) ||
          (newEt > exSt && newEt <= exEt) ||
          (newSt <= exSt && newEt >= exEt)
        );
      });
      if (overlapping) {
        alert("시간이 겹치는 일정이 존재합니다.");
        return;
      }
    }

    const newTodo = {
      content: inputValue,
      checkStatus: 0,
      thisDay: `${selectedDate}T00:00:00.000Z`,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || "Failed to add todo");
      }
      const data = await res.json();
      setSchedules([...schedules, data]);
    } catch (err) {
      console.error("Failed to add todo:", err);
    }

    // 입력창 닫기
    setInputValue("");
    setShowInput(false);
  };

  // 체크박스
  const toggleTodoCompletion = async (todoId) => {
    const t = schedules.find((td) => td.id === todoId);
    if (!t) return;
    const updated = { ...t, checkStatus: t.checkStatus === 0 ? 1 : 0 };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setSchedules(schedules.map((td) => (td.id === todoId ? updated : td)));
        setEditId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 삭제
  const handleDelete = async (todoId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${todoId}`, { method: "DELETE" });
      if (res.ok) {
        setSchedules(schedules.filter((td) => td.id !== todoId));
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 편집 시작
  const startEditTodo = (todo) => {
    setEditId(todo.id);
    setEditContent(todo.content || "");
    if (todo.startTime) {
      const sDate = new Date(todo.startTime);
      setEditStartHour(String(sDate.getHours()));
      setEditStartMinute(String(sDate.getMinutes()).padStart(2, "0"));
    } else {
      setEditStartHour("0");
      setEditStartMinute("00");
    }
    if (todo.endTime) {
      const eDate = new Date(todo.endTime);
      setEditEndHour(String(eDate.getHours()));
      setEditEndMinute(String(eDate.getMinutes()).padStart(2, "0"));
    } else {
      setEditEndHour("0");
      setEditEndMinute("00");
    }
  };

  // 편집 저장
  const handleEditSave = async (todoId) => {
    const t = schedules.find((td) => td.id === todoId);
    if (!t) return;

    const updated = { ...t, content: editContent };
    if (t.startTime || t.endTime) {
      const newSt = localTimeToServerUtc(selectedDate, +editStartHour, +editStartMinute);
      const newEt = localTimeToServerUtc(selectedDate, +editEndHour, +editEndMinute);
      updated.startTime = newSt;
      updated.endTime   = newEt;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("투두 수정 실패");
      setSchedules(schedules.map((td) => (td.id === todoId ? updated : td)));
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 시/분 select
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = ["00", "10", "20", "30", "40", "50"];

  // 현재 selectedDate의 일정만 보임
  const filteredSchedules = schedules.filter((todo) => {
    if (!todo.thisDay) return false;
    const dayStr = todo.thisDay.slice(0, 10);
    return dayStr === selectedDate;
  });

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

      {/* 입력창 (showInput) */}
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
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleAddTodo}
          >
            추가
          </button>
        </div>
      )}

      {/* 시간 설정창 (isTimeTodo && showTimePicker) */}
      {isTimeTodo && showTimePicker && showInput && (
        <div className="bg-white p-3 m-3 border rounded space-y-2">
          <div>
            <label>시작 시간:</label>
            <select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h.padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>끝나는 시간:</label>
            <select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h.padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 투두 목록 */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(43vh - 60px - 40px)", flexGrow: 1 }}>
        <ul className="divide-y mx-4">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((todo) => {
              const checked = todo.checkStatus === 1;
              const checkIcon = checked ? CheckedBoxIcon : UncheckBoxIcon;
              const displayTime = todo.startTime ? formatTime(todo.startTime) : "";
              const hasTime = !!(todo.startTime || todo.endTime);
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

                  {isEditing ? (
                    <div className="ml-2 flex flex-col space-y-2">
                      <div>
                        <label className="block text-sm font-medium">이름:</label>
                        <input
                          className="border p-1 w-full"
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                      </div>

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
                                {hours.map((h) => (
                                  <option key={`start-h-${h}`} value={h}>
                                    {h.padStart(2, "0")}
                                  </option>
                                ))}
                              </select>
                              :
                              <select
                                className="border p-1"
                                value={editStartMinute}
                                onChange={(e) => setEditStartMinute(e.target.value)}
                              >
                                {minutes.map((m) => (
                                  <option key={`start-m-${m}`} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium">끝나는 시간:</label>
                            <div className="flex items-center space-x-1">
                              <select
                                className="border p-1"
                                value={editEndHour}
                                onChange={(e) => setEditEndHour(e.target.value)}
                              >
                                {hours.map((h) => (
                                  <option key={`end-h-${h}`} value={h}>
                                    {h.padStart(2, "0")}
                                  </option>
                                ))}
                              </select>
                              :
                              <select
                                className="border p-1"
                                value={editEndMinute}
                                onChange={(e) => setEditEndMinute(e.target.value)}
                              >
                                {minutes.map((m) => (
                                  <option key={`end-m-${m}`} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      <button
                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEditSave(todo.id)}
                      >
                        확인
                      </button>
                    </div>
                  ) : (
                    <span className="ml-2">
                      {todo.content}
                      {displayTime && ` (${displayTime})`}
                    </span>
                  )}

                  {showEditOptions === todo.id && !isEditing && (
                    <div className="absolute right-0 top-0 rounded-lg bg-white p-1 shadow-md">
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
    </div>
  );
};

export default TodoListComponent;
