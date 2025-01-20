import React, { useEffect, useRef, useState } from "react";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore } from "../../store";
import { parseISO } from "date-fns";

interface RoutineFormData {
  name: string;
  day: string;      // "Sun" | "Mon" | ... | "Sat"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

// 루틴을 그리드에 칠할 때 저장하는 정보
interface RoutineInfo {
  content: string;     // 루틴 이름
  startTime: string;   // 표시용 (ex: "09:00")
  endTime: string;     // 표시용 (ex: "10:00")
  isCenter?: boolean;  // (지금은 사용 안 함, 그리드 상 텍스트는 제거)
}

const FixGridPage = ({ onPageChange }: { onPageChange: (page: string) => void }) => {
  console.log("[FixGridPage] *** RENDER ***");

  const [showGrid, setShowGrid] = useState(true);

  // ---------------------------
  // 모달들 (추가/수정)
  // ---------------------------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 폼
  const [routineForm, setRoutineForm] = useState<RoutineFormData>({
    name: "",
    day: "Sun",
    startTime: "09:00",
    endTime: "10:00",
  });
  // 수정 폼
  const [editRoutineId, setEditRoutineId] = useState<number | null>(null);
  const [editRoutineForm, setEditRoutineForm] = useState<RoutineFormData>({
    name: "",
    day: "Sun",
    startTime: "09:00",
    endTime: "10:00",
  });

  // ---------------------------
  // 그리드에 색칠할 정보
  // ---------------------------
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  // ---------------------------
  // Tooltip 상태 (호버 시 표시)
  // ---------------------------
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  // ---------------------------
  // store
  // ---------------------------
  const memberId = useStore((s) => s.memberId);
  const routines = useStore((s) => s.routines);
  const fetchRoutines = useStore((s) => s.fetchRoutines);
  const addRoutine = useStore((s) => s.addRoutine);
  const updateRoutine = useStore((s) => s.updateRoutine);
  const deleteRoutine = useStore((s) => s.deleteRoutine);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ---------------------------
  // 첫 마운트 시 루틴 리스트 불러오기
  // ---------------------------
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    fetchRoutines(memberId).catch((err) => {
      console.error("[FixGridPage] fetchRoutines error:", err);
    });
  }, [memberId, fetchRoutines]);

  // ---------------------------
  // routines가 바뀔 때 -> 그리드에 매핑
  // ---------------------------
  useEffect(() => {
    console.log("[FixGridPage] useEffect => routines changed:", routines);

    if (!routines || routines.length === 0) {
      setHighlightedCells({});
      return;
    }

    // 새로 계산
    const newHighlighted: { [key: string]: RoutineInfo } = {};

    // 05:00 기준으로 인덱스 계산
    function getGridIndexes(dateObj: Date) {
      const hour = dateObj.getHours();
      const min = dateObj.getMinutes();
      let totalMinutes = (hour - 5) * 60 + min;

      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }
      if (totalMinutes >= 24 * 60) {
        totalMinutes -= 24 * 60;
      }

      const timeIndex = Math.floor(totalMinutes / 30); // 0..47
      const remainder = totalMinutes % 30;
      let partIndex = Math.floor(remainder / 10);      // 0..2
      if (partIndex > 2) partIndex = 2;

      return { timeIndex, partIndex };
    }

    // 루틴 매핑
    function mapRoutineToCells(startStr: string, endStr: string, dayIndex: number, routine: any) {
      const st = parseISO(startStr);
      const et = parseISO(endStr);
      if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};

      const stIdx = getGridIndexes(st);
      const etIdx = getGridIndexes(et);

      console.log(
        `Routine: ${routine.title}, dayIndex: ${dayIndex}, StartIdx: ${stIdx.timeIndex}-${stIdx.partIndex}, EndIdx: ${etIdx.timeIndex}-${etIdx.partIndex}`
      );

      const cellsToFill: { [key: string]: RoutineInfo } = {};

      for (let t = stIdx.timeIndex; t <= etIdx.timeIndex; t++) {
        let pStart = t === stIdx.timeIndex ? stIdx.partIndex : 0;
        let pEnd   = t === etIdx.timeIndex ? etIdx.partIndex - 1 : 2;
        if (pEnd < pStart) continue; // 정각 등으로 skip

        for (let p = pStart; p <= pEnd; p++) {
          const key = `${dayIndex}-${t}-${p}`;
          cellsToFill[key] = {
            content: routine.title, // 마우스 호버 시 보여줄 텍스트
            startTime: st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            endTime: et.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isCenter: false,
          };
        }
      }
      return cellsToFill;
    }

    routines.forEach((r: any) => {
      if (!r.day || !r.startTime || !r.endTime) return;
      const dayIndex = daysOfWeek.indexOf(r.day.trim());
      if (dayIndex < 0) return;

      const routineCells = mapRoutineToCells(r.startTime, r.endTime, dayIndex, r);
      if (routineCells) {
        Object.assign(newHighlighted, routineCells);
      }
    });

    setHighlightedCells(newHighlighted);
  }, [routines]);

  // ---------------------------
  // 날짜/시간 변환 유틸
  // ---------------------------
  function formatLocalDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
  }

  // "HH:mm" -> "YYYY-MM-DDTHH:mm:ss"
  function toIsoWithoutOffset(day: string, hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const now = new Date();
    const currentDay = now.getDay();
    const targetDayIndex = daysOfWeek.indexOf(day);
    let diff = (targetDayIndex - currentDay + 7) % 7;
    // diff===0이면 오늘 날짜

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    targetDate.setHours(h, m, 0, 0);
    return formatLocalDate(targetDate);
  }

  // ---------------------------
  // 모달: 루틴 추가
  // ---------------------------
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleAddRoutineClick = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isoStart = toIsoWithoutOffset(routineForm.day, routineForm.startTime);
    const isoEnd   = toIsoWithoutOffset(routineForm.day, routineForm.endTime);

    try {
      await addRoutine(memberId, {
        title: routineForm.name,
        day: routineForm.day,
        startTime: isoStart,
        endTime: isoEnd,
      });
      alert("루틴이 추가되었습니다.");
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("addRoutine failed:", err);
      alert("루틴 추가 중 오류");
    }
  };

  // ---------------------------
  // 모달: 루틴 관리(수정/삭제)
  // ---------------------------
  const handleOpenManageModal = () => setIsManageModalOpen(true);
  const handleCloseManageModal = () => setIsManageModalOpen(false);

  // 편집 모달 열기
  const handleOpenEditModal = (routine: any) => {
    setEditRoutineId(routine.id);
    setEditRoutineForm({
      name: routine.title || "",
      day: routine.day || "Sun",
      startTime: extractHHmm(routine.startTime),
      endTime: extractHHmm(routine.endTime),
    });
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditRoutineId(null);
  };

  // "HH:mm" 추출
  function extractHHmm(isoString: string) {
    if (!isoString) return "09:00";
    const date = parseISO(isoString);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // 편집 "저장"
  const handleSaveEdit = async () => {
    if (!editRoutineId || !memberId) return;

    const isoStart = toIsoWithoutOffset(editRoutineForm.day, editRoutineForm.startTime);
    const isoEnd   = toIsoWithoutOffset(editRoutineForm.day, editRoutineForm.endTime);

    try {
      await updateRoutine(editRoutineId, {
        title: editRoutineForm.name,
        day: editRoutineForm.day,
        startTime: isoStart,
        endTime: isoEnd,
      });
      alert("루틴 수정 완료");
      setIsEditModalOpen(false);
      setEditRoutineId(null);
    } catch (err) {
      console.error("updateRoutine failed:", err);
      alert("루틴 수정 중 오류");
    }
  };

  // 루틴 삭제
  const handleDeleteRoutine = async (routineId: number) => {
    const confirmDel = window.confirm("정말 삭제?");
    if (!confirmDel) return;
    try {
      await deleteRoutine(routineId);
      alert("루틴이 삭제되었습니다.");
    } catch (err) {
      console.error("deleteRoutine failed:", err);
      alert("삭제 중 오류");
    }
  };

  // ---------------------------
  // "확인" 버튼 => 캘린더 이동
  // ---------------------------
  const handleConfirmClick = () => {
    setShowGrid(false);
    onPageChange("calendar");
  };

  // ---------------------------
  // 요일별 루틴 그룹핑
  // ---------------------------
  function getRoutinesByDay() {
    const grouped: { [day: string]: any[] } = {};
    daysOfWeek.forEach((d) => (grouped[d] = []));
    routines.forEach((r: any) => {
      if (r.day && daysOfWeek.includes(r.day)) {
        grouped[r.day].push(r);
      }
    });
    return grouped;
  }
  const routinesByDay = getRoutinesByDay();

  // ---------------------------
  // WeekGrid에 넘길 "onCellHover"
  // ---------------------------
  const handleCellHover = (
    routine: RoutineInfo | null,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!routine) {
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }
    // 루틴이 있는 셀 => 툴팁 표시
    setTooltip({
      visible: true,
      x: e.clientX + 10, // 살짝 우하단
      y: e.clientY + 10,
      content: `${routine.content}\n${routine.startTime} ~ ${routine.endTime}`,
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 요일 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-evenly", padding: "20px" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ marginLeft: "40px", fontSize: "18px" }}>
            {day}
          </div>
        ))}
      </div>

      {/* WeekGrid */}
      <div style={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
        <WeekGrid
          showGrid={showGrid}
          highlightedCells={highlightedCells}
          onCellHover={handleCellHover} // ★ 마우스 호버 콜백
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        {/* 왼쪽 버튼들 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{ width: "100px", height: "40px", backgroundColor: "#A8C8F6", color: "#fff",
                     border: "none", borderRadius: "4px"}}
            onClick={handleOpenAddModal}
          >
            루틴 추가
          </button>
          <button
            style={{ width: "100px", height: "40px", backgroundColor: "#C8A8E6", color: "#fff",
                     border: "none", borderRadius: "4px"}}
            onClick={handleOpenManageModal}
          >
            루틴 수정
          </button>
        </div>
        <ConfirmButton text="확인" onClick={handleConfirmClick} />
      </div>

      {/* Hover Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "5px 8px",
            borderRadius: "4px",
            whiteSpace: "pre-line", // \n 지원
            pointerEvents: "none",
            zIndex: 99999,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/*
        ============================
        루틴 추가 모달
        ============================
      */}
      {isAddModalOpen && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 9999
          }}
          onClick={handleCloseAddModal}
        >
          <div
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>루틴 추가</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <label>
                루틴 이름:
                <input
                  type="text"
                  value={routineForm.name}
                  onChange={(e) => setRoutineForm({ ...routineForm, name: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label>
                요일:
                <select
                  value={routineForm.day}
                  onChange={(e) => setRoutineForm({ ...routineForm, day: e.target.value })}
                  style={{ marginLeft: "10px" }}
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                시작 시간:
                <input
                  type="time"
                  step="600"
                  value={routineForm.startTime}
                  onChange={(e) => setRoutineForm({ ...routineForm, startTime: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label>
                끝나는 시간:
                <input
                  type="time"
                  step="600"
                  value={routineForm.endTime}
                  onChange={(e) => setRoutineForm({ ...routineForm, endTime: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
              <button onClick={handleCloseAddModal}>취소</button>
              <button onClick={handleAddRoutineClick}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/*
        ============================
        루틴 수정/삭제 모달
        ============================
      */}
      {isManageModalOpen && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 9999
          }}
          onClick={handleCloseManageModal}
        >
          <div
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>루틴 수정/삭제</h3>
            {/* 요일별 루틴 */}
            <div style={{ maxHeight: "70vh", overflowY: "auto", marginTop: "10px" }}>
              {daysOfWeek.map((day) => {
                const dayRoutines = routinesByDay[day];
                if (!dayRoutines || dayRoutines.length === 0) return null;
                return (
                  <div key={day} style={{ marginBottom: "16px" }}>
                    <h4>{day}</h4>
                    <ul style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {dayRoutines.map((r) => (
                        <li
                          key={r.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: "4px 0",
                          }}
                        >
                          <div>
                            <strong>{r.title}</strong>{" "}
                            (<small>
                              {extractHHmm(r.startTime)} ~ {extractHHmm(r.endTime)}
                            </small>)
                          </div>
                          <div>
                            <button
                              style={{ marginRight: "8px" }}
                              onClick={() => handleOpenEditModal(r)}
                            >
                              수정
                            </button>
                            <button onClick={() => handleDeleteRoutine(r.id)}>삭제</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={handleCloseManageModal}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/*
        ============================
        루틴 편집 서브모달
        ============================
      */}
      {isEditModalOpen && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 9999
          }}
          onClick={handleCloseEditModal}
        >
          <div
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>루틴 수정</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <label>
                루틴 이름:
                <input
                  type="text"
                  value={editRoutineForm.name}
                  onChange={(e) => setEditRoutineForm({ ...editRoutineForm, name: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label>
                요일:
                <select
                  value={editRoutineForm.day}
                  onChange={(e) => setEditRoutineForm({ ...editRoutineForm, day: e.target.value })}
                  style={{ marginLeft: "10px" }}
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                시작 시간:
                <input
                  type="time"
                  step="600"
                  value={editRoutineForm.startTime}
                  onChange={(e) => setEditRoutineForm({ ...editRoutineForm, startTime: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label>
                끝나는 시간:
                <input
                  type="time"
                  step="600"
                  value={editRoutineForm.endTime}
                  onChange={(e) => setEditRoutineForm({ ...editRoutineForm, endTime: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
              <button onClick={handleCloseEditModal}>취소</button>
              <button onClick={handleSaveEdit}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 버튼 */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        {/* showGrid 여부와 상관없이 필요하면... 
            <ConfirmButton text="확인" onClick={handleConfirmClick} /> 
            (위에서 이미 렌더되었다면 중복 제거)
        */}
      </div>
    </div>
  );
};

export default FixGridPage;
