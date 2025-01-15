// FixGridPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';
import { useStore, Routine } from '../../store'; // Routine 임포트
import { parseISO } from 'date-fns';

// 루틴 추가 모달에서 입력할 폼 데이터 형태
interface RoutineFormData {
  name: string;
  day: string; // "Sun" | "Mon" | ... | "Sat"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

// RoutineInfo 인터페이스 재사용
interface RoutineInfo {
  content: string;
  startTime: string;
  endTime: string;
  isCenter?: boolean;
}

const FixGridPage = ({ onPageChange }: { onPageChange: (page: string) => void }) => {
  console.log("[FixGridPage] *** RENDER ***");

  // -----------------------------
  // 컴포넌트 상태
  // -----------------------------
  const [showGrid, setShowGrid] = useState(true);

  // 루틴 추가 모달 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 폼
  const [routineForm, setRoutineForm] = useState<RoutineFormData>({
    name: '',
    day: 'Sun',
    startTime: '09:00',
    endTime: '10:00',
  });

  // 그리드에서 이미 색칠되어야 할 셀들
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  // -----------------------------
  // store
  // -----------------------------
  const memberId = useStore((s) => s.memberId);
  const routines = useStore((s) => s.routines);
  const fetchRoutines = useStore((s) => s.fetchRoutines);
  const addRoutine = useStore((s) => s.addRoutine);

  // -----------------------------
  // daysOfWeek 정의 (컴포넌트 전체에서 사용)
  // -----------------------------
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // -----------------------------
  // 처음 마운트 시 루틴 목록 불러오기 (무한루프 방지용 ref)
  // -----------------------------
  const didFetchRef = useRef(false);
  useEffect(() => {
    console.log("[FixGridPage] useEffect => check fetchRoutines");
    console.log("   memberId:", memberId, " / didFetchRef.current:", didFetchRef.current);

    if (!memberId) {
      console.log("[FixGridPage] memberId is null => cannot fetch routines");
      return;
    }
    if (didFetchRef.current) {
      console.log("[FixGridPage] Already fetched => skip");
      return;
    }
    didFetchRef.current = true;

    console.log("[FixGridPage] => calling fetchRoutines...");
    fetchRoutines(memberId)
      .then(() => {
        console.log("[FixGridPage] fetchRoutines completed");
      })
      .catch((err) => {
        console.error("[FixGridPage] fetchRoutines error:", err);
      });
  }, [memberId, fetchRoutines]);

  // -----------------------------
  // routines가 바뀔 때마다 => highlightedCells 재계산
  // -----------------------------
  useEffect(() => {
    console.log("[FixGridPage] useEffect => routines changed:", routines);

    if (!routines || routines.length === 0) {
      console.log("[FixGridPage] no routines => clearing highlightedCells");
      setHighlightedCells({});
      return;
    }

    // 새로 계산할 객체
    const newHighlighted: { [key: string]: RoutineInfo } = {};

    // 그리드 인덱스 계산 함수
    function getGridIndexes(dateObj: Date) {
      const hour = dateObj.getHours();
      const min = dateObj.getMinutes();
      let totalMinutes = (hour - 5) * 60 + min; // 5시 = index 0

      if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // 음수인 경우 1440을 더해 양수로 변환
      }

      if (totalMinutes >= 24 * 60) {
        totalMinutes -= 24 * 60; // 1440 이상인 경우 1440을 빼서 0~1439로 조정
      }

      const timeIndex = Math.floor(totalMinutes / 30); // 0 ~ 47
      const remainder = totalMinutes % 30;
      let partIndex = Math.floor(remainder / 10); // 0,1,2

      if (partIndex > 2) partIndex = 2;

      return { timeIndex, partIndex };
    }

    // 루틴 셀 매핑 함수 (여러 셀을 채움)
    function mapRoutineToCells(startStr: string, endStr: string, dayIndex: number, sch: Routine): { [key: string]: RoutineInfo } {
      const st = parseISO(startStr);
      const et = parseISO(endStr);
      if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};

      const stIdx = getGridIndexes(st);
      const etIdx = getGridIndexes(et);
      console.log(`Routine: ${sch.title}, DayIndex: ${dayIndex}, StartIdx: ${stIdx.timeIndex}-${stIdx.partIndex}, EndIdx: ${etIdx.timeIndex}-${etIdx.partIndex}`);

      if (stIdx.timeIndex < 0 || etIdx.timeIndex < 0) return {};

      const cellsToFill: { [key: string]: RoutineInfo } = {};

      // 시작 시간과 종료 시간 사이의 모든 셀을 채웁니다.
      for (let t = stIdx.timeIndex; t <= etIdx.timeIndex; t++) {
        let pStart = 0;
        let pEnd = 2;

        if (t === stIdx.timeIndex) {
          pStart = stIdx.partIndex;
        }
        if (t === etIdx.timeIndex) {
          pEnd = etIdx.partIndex;
        }

        for (let p = pStart; p <= pEnd; p++) {
          const key = `${dayIndex}-${t}-${p}`;
          cellsToFill[key] = {
            content: sch.title,
            startTime: st.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: et.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCenter: false, // 모든 셀에 표시
          };
        }
      }

      return cellsToFill;
    }

    routines.forEach((r) => {
      console.log("   [FixGridPage] parsing routine =>", r);
      
      // 방어 코드 추가: r.day이 undefined인지 확인
      if (!r.day) {
        console.error("Routine 'day' is undefined:", r);
        return;
      }

      const dayIndex = daysOfWeek.indexOf(r.day.trim());

      console.log(`     Parsed day: '${r.day}', dayIndex: ${dayIndex}`);

      if (dayIndex < 0) {
        console.log("     invalid day => skip");
        return;
      }

      if (!r.startTime || !r.endTime) {
        console.log("     either startTime or endTime is null => skip");
        return;
      }

      const routineCells = mapRoutineToCells(r.startTime, r.endTime, dayIndex, r);
      Object.assign(newHighlighted, routineCells);
    });

    console.log("[FixGridPage] => final newHighlighted:", newHighlighted);
    setHighlightedCells(newHighlighted);
  }, [routines]); // daysOfWeek 제거 (불필요한 의존성)

  // -----------------------------
  // 루틴 추가 관련 함수들
  // -----------------------------
  const handleOpenModal = () => setIsModalOpen(true); // handleOpenModal 정의
  const handleCloseModal = () => setIsModalOpen(false); // handleCloseModal 정의

  // -----------------------------
  // 루틴 추가 (POST)
  // -----------------------------
  const handleAddRoutineClick = async () => {
    console.log("[FixGridPage] handleAddRoutineClick triggered!");

    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // Helper function to format Date to 'YYYY-MM-DDTHH:mm:ss'
    const formatDate = (date: Date): string => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // Function to get the next occurrence of the selected day
    const getNextDateForDay = (day: string): Date => {
      const daysOfWeekLocal = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const currentDay = new Date().getDay(); // 0=Sun, 1=Mon, ...,6=Sat
      const targetDay = daysOfWeekLocal.indexOf(day.trim());
      if (targetDay < 0) {
        alert("유효하지 않은 요일입니다.");
        throw new Error("Invalid day");
      }
      const diff = (targetDay - currentDay + 7) % 7;
      const daysToAdd = diff === 0 ? 7 : diff; // 다음 주 같은 요일
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      return nextDate;
    }

    // "HH:mm" -> 'YYYY-MM-DDTHH:mm:ss' (local time)
    function toIso(day: string, hhmm: string): string {
      const [hh, mm] = hhmm.split(":").map(Number);
      const targetDate = getNextDateForDay(day);
      targetDate.setHours(hh, mm, 0, 0);
      return formatDate(targetDate); // 예: "2025-01-13T09:00:00"
    }

    const isoStart = toIso(routineForm.day, routineForm.startTime);
    const isoEnd = toIso(routineForm.day, routineForm.endTime);

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
      // routines가 변경되면 위의 useEffect로 인해 highlightedCells 재계산
    } catch (err) {
      console.error("[FixGridPage] addRoutine failed:", err);
      alert("루틴 추가 중 오류가 발생했습니다.");
    }
  };

  // -----------------------------
  // 우측 하단: "확인" 버튼 => WeekGrid 숨기고 다른 페이지로 전환
  // -----------------------------
  const handleConfirmClick = () => {
    console.log("[FixGridPage] Confirm button clicked => go to 'calendar'");
    setShowGrid(false);
    onPageChange('calendar');
  };

  // -----------------------------
  // render
  // -----------------------------
  return (
    <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 요일 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px' }}>
        {daysOfWeek.map(day => (
          <div
            key={day}
            style={{ marginLeft: '40px', fontSize: '18px' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* WeekGrid를 flex-grow로 설정하여 남은 공간을 채움 */}
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <WeekGrid
          showGrid={showGrid}
          highlightedCells={highlightedCells}
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        {/* 왼쪽 하단: 루틴 추가 버튼 */}
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

        {/* 오른쪽 하단: 확인 버튼 */}
        <ConfirmButton
          text="확인"
          onClick={handleConfirmClick}
        />
      </div>

      {/* 루틴 추가 모달 */}
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
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </label>
              <label>
                시작 시간:
                <input
                  type="time"
                  step="600" // 10분 단위로 제한
                  value={routineForm.startTime}
                  onChange={(e) => setRoutineForm({ ...routineForm, startTime: e.target.value })}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label>
                끝나는 시간:
                <input
                  type="time"
                  step="600" // 10분 단위로 제한
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
