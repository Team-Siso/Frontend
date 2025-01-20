import React, { useEffect, useRef, useState } from "react";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore } from "../../store";
import { parseISO } from "date-fns";

interface RoutineFormData {
  name: string;
  day: string; // "Sun" | "Mon" | ... | "Sat"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

interface RoutineInfo {
  content: string;
  startTime: string;
  endTime: string;
  isCenter?: boolean;
}

const FixGridPage = ({ onPageChange }: { onPageChange: (page: string) => void }) => {
  console.log("[FixGridPage] *** RENDER ***");

  const [showGrid, setShowGrid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [routineForm, setRoutineForm] = useState<RoutineFormData>({
    name: "",
    day: "Sun",
    startTime: "09:00",
    endTime: "10:00",
  });

  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  // -----------------------------
  // store
  // -----------------------------
  const memberId = useStore((s) => s.memberId);
  const routines = useStore((s) => s.routines);
  const fetchRoutines = useStore((s) => s.fetchRoutines);
  const addRoutine = useStore((s) => s.addRoutine);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // -----------------------------
  // 초기 fetch (1회)
  // -----------------------------
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    fetchRoutines(memberId).catch((err) => {
      console.error("[FixGridPage] fetchRoutines error:", err);
    });
  }, [memberId, fetchRoutines]);

  // -----------------------------
  // routines 바뀔 때 -> 그리드 업데이트
  // -----------------------------
  useEffect(() => {
    console.log("[FixGridPage] useEffect => routines changed:", routines);

    if (!routines || routines.length === 0) {
      setHighlightedCells({});
      return;
    }

    const newHighlighted: { [key: string]: RoutineInfo } = {};

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

      const timeIndex = Math.floor(totalMinutes / 30);
      const remainder = totalMinutes % 30;
      let partIndex = Math.floor(remainder / 10);
      if (partIndex > 2) partIndex = 2;

      return { timeIndex, partIndex };
    }

    // 수정: 정각이면 다음 칸이 채워지는 문제를 막기 위해
    function mapRoutineToCells(startStr: string, endStr: string, dayIndex: number, sch: any) {
      const st = parseISO(startStr);
      const et = parseISO(endStr);
      if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};

      const stIdx = getGridIndexes(st);
      const etIdx = getGridIndexes(et);

      console.log(
        `Routine: ${sch.title}, DayIndex: ${dayIndex}, StartIdx: ${stIdx.timeIndex}-${stIdx.partIndex}, EndIdx: ${etIdx.timeIndex}-${etIdx.partIndex}`
      );

      const cellsToFill: { [key: string]: RoutineInfo } = {};

      for (let t = stIdx.timeIndex; t <= etIdx.timeIndex; t++) {
        let pStart = t === stIdx.timeIndex ? stIdx.partIndex : 0;
        // 종료 슬롯에선 partIndex 하나 빼서 처리
        let pEnd = t === etIdx.timeIndex ? etIdx.partIndex - 1 : 2; 
        if (pEnd < pStart) continue; // 정각 같은 경우 pEnd < pStart => 그 칸은 그리지 않음

        for (let p = pStart; p <= pEnd; p++) {
          const key = `${dayIndex}-${t}-${p}`;
          cellsToFill[key] = {
            content: sch.title,
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

  // -----------------------------
  // 모달 열기/닫기
  // -----------------------------
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // -----------------------------
  // 날짜/시간 변환
  // -----------------------------
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

  // "HH:mm" -> "YYYY-MM-DDTHH:mm:ss" (당일/이번주 처리)
  function toIsoWithoutOffset(day: string, hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const now = new Date();
    const currentDay = now.getDay();
    const targetDayIndex = daysOfWeek.indexOf(day);

    // diff 계산
    let diff = (targetDayIndex - currentDay + 7) % 7;

    // [중요] diff===0이면 "오늘"로 처리 -> 즉시 표시
    // 새 루틴을 추가하면 오늘 그리드에 바로 보임
    // (기존 코드처럼 if(diff===0) diff=7; 을 제거)
    // => 같은 요일이라면 오늘 날짜 그대로
    //    => 과거 시간일 수 있다는 단점은 있지만, "즉시 표시"를 위해 필요한 로직
    // 원하는 대로 커스터마이징 가능

    const targetDate = new Date();
    targetDate.setDate(now.getDate() + diff);
    targetDate.setHours(h, m, 0, 0);
    return formatLocalDate(targetDate);
  }

  // -----------------------------
  // 루틴 추가
  // -----------------------------
  const handleAddRoutineClick = async () => {
    console.log("[FixGridPage] handleAddRoutineClick triggered!");

    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isoStart = toIsoWithoutOffset(routineForm.day, routineForm.startTime);
    const isoEnd = toIsoWithoutOffset(routineForm.day, routineForm.endTime);

    console.log("[FixGridPage] => about to call addRoutine with", {
      title: routineForm.name,
      day: routineForm.day,
      startTime: isoStart,
      endTime: isoEnd,
    });

    try {
      await addRoutine(memberId, {
        title: routineForm.name,
        day: routineForm.day,
        startTime: isoStart,
        endTime: isoEnd,
      });
      console.log("[FixGridPage] addRoutine succeeded => closing modal");
      alert("루틴이 추가되었습니다.");
      setIsModalOpen(false);
      // 여기서 이미 store.routines가 업데이트 -> useEffect -> 그리드 리렌더
    } catch (err) {
      console.error("[FixGridPage] addRoutine failed:", err);
      alert("루틴 추가 중 오류가 발생했습니다.");
    }
  };

  // -----------------------------
  // 우측 하단 '확인' 버튼
  // -----------------------------
  const handleConfirmClick = () => {
    console.log("[FixGridPage] Confirm button clicked => go to 'calendar'");
    setShowGrid(false);
    onPageChange("calendar");
  };

  // -----------------------------
  // render
  // -----------------------------
  return (
    <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 요일 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px' }}>
        {daysOfWeek.map(day => (
          <div key={day} style={{ marginLeft: '40px', fontSize: '18px' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <button
          onClick={handleOpenModal}
          style={{
            width: "100px",
            height: "40px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          루틴 추가
        </button>
        <ConfirmButton text="확인" onClick={handleConfirmClick} />
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)"
          }}
          onClick={handleCloseModal}
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
              <button onClick={handleCloseModal}>취소</button>
              <button onClick={handleAddRoutineClick}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixGridPage;
