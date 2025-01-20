import React, { useEffect, useRef, useState, useMemo } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
//import ConfirmButton from "../ConfirmButton";
import { useStore, Schedule } from "../../store";
import { parseISO, format } from "date-fns";

interface RoutineInfo {
  content: string;
  startTime: string; 
  endTime: string;
  isCenter?: boolean;
}

interface WeekGridPageProps {
  selectedDate: Date;
}

const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  const [showGrid, setShowGrid] = useState(true);

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  // Store
  const memberId = useStore((s) => s.memberId);
  const schedules: Schedule[] = useStore((s) => s.schedules);
  const fetchSchedules = useStore((s) => s.fetchSchedules);

  // 한 번만 fetch
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    fetchSchedules(memberId).catch((err) => {
      console.error("[WeekGridPage] fetchSchedules error:", err);
    });
  }, [memberId, fetchSchedules]);

  // 주간 날짜 계산
  function getStartOfWeekLocal(date: Date) {
    const dayOfWeek = date.getDay(); // 0=일요일
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d - dayOfWeek);
  }

  const weekDates = useMemo(() => {
    const start = getStartOfWeekLocal(selectedDate);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(start.getTime());
      dd.setDate(dd.getDate() + i);
      dates.push(dd);
    }
    return dates;
  }, [selectedDate]);

  // 05:00 ~ 다음날05:00 인덱스
  function getGridIndexes(dateObj: Date) {
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    let totalMinutes = (hour - 5) * 60 + min;
    if (totalMinutes < 0 || totalMinutes >= 24 * 60) {
      return { timeIndex: -1, partIndex: 0 };
    }
    const base30 = Math.floor(totalMinutes / 30);
    const remainder = totalMinutes % 30;
    const timeIndex = base30;
    let partIndex = Math.floor(remainder / 10);
    if (partIndex > 2) partIndex = 2;
    return { timeIndex, partIndex };
  }

  // 스케줄 → 여러 셀 매핑
  function mapScheduleToCells(
    startStr: string,
    endStr: string,
    dayIndex: number,
    sch: Schedule
  ): { [key: string]: RoutineInfo } {
    const st = parseISO(startStr);
    const et = parseISO(endStr);
    if (isNaN(st.getTime()) || isNaN(et.getTime()) || et <= st) return {};

    const result: { [key: string]: RoutineInfo } = {};

    // 10분 단위로 모든 part를 채움
    let currentTime = new Date(st.getTime());
    const durationMinutes = (et.getTime() - st.getTime()) / 60000;
    const totalParts = Math.floor(durationMinutes / 10);
    let count = 0;

    while (count < totalParts) {
      const { timeIndex, partIndex } = getGridIndexes(currentTime);
      if (timeIndex === -1) break;

      const key = `${dayIndex}-${timeIndex}-${partIndex}`;
      result[key] = {
        content: sch.content,
        startTime: st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        endTime: et.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // 10분 후로 이동
      currentTime.setMinutes(currentTime.getMinutes() + 10);
      count++;
    }

    return result;
  }

  // highlightCells
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  useEffect(() => {
    const newHighlighted: { [key: string]: RoutineInfo } = {};

    weekDates.forEach((wd, dayIndex) => {
      const wdString = format(wd, "yyyy-MM-dd"); 
      schedules.forEach((sch) => {
        if (!sch.thisDay) return;
        const scheduleDate = parseISO(sch.thisDay);
        if (isNaN(scheduleDate.getTime())) return;
        const scheduleDay = format(scheduleDate, "yyyy-MM-dd");
        if (scheduleDay === wdString) {
          if (sch.startTime && sch.endTime) {
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex, sch);
            Object.assign(newHighlighted, partial);
          }
        }
      });
    });

    setHighlightedCells(newHighlighted);
  }, [schedules, weekDates]);

  // "확인" 버튼
  const handleConfirmClick = () => {
    setShowGrid(false);
    // 다른 페이지 이동 로직 등
  };

  // *** WeekGrid에서 마우스 호버 시 받아오는 콜백
  const handleCellHover = (
    routine: RoutineInfo | null,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!routine) {
      // 마우스 떠남 => 툴팁 숨김
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }

    // 마우스 올라옴 => 일정 정보 표시
    const { clientX, clientY } = e;
    setTooltip({
      visible: true,
      x: clientX + 10,
      y: clientY + 10,
      content: `${routine.content}\n${routine.startTime} ~ ${routine.endTime}`,
    });
  };

  return (
    <div style={{ position: "relative", height: "700px" }}>
      {/* 주간 날짜 헤더 */}
      <WeekDates selectedDate={selectedDate} />

      {/* 요일 헤더 (Sun ~ Sat) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "5px 0px",
          marginLeft: "80px", // 왼쪽 시간 라벨 만큼 띄우기
          marginRight: "10px", // 적당히
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            style={{
              width: "100px", // 여유 공간
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 실제 WeekGrid 표시 */}
      <WeekGrid
        showGrid={showGrid}
        highlightedCells={highlightedCells}
        onCellHover={handleCellHover} // 호버 콜백
      />

      {/* 하단 버튼 */}
      {/* <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <ConfirmButton
          onClick={handleConfirmClick}
          text="확인"
          style={{ width: "74px", height: "42px" }}
        />
      </div> */}

      {/* 호버 툴팁 */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "5px 8px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "pre-line",
            zIndex: 99999,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default WeekGridPage;
