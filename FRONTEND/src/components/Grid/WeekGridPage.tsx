// WeekGridPage.tsx

import React, { useEffect, useRef, useState } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore } from "../../store";
import { parseISO } from "date-fns";

// Schedule 인터페이스 정의 (Routine -> Schedule로 통일)
interface Schedule {
  id: number;
  content: string;
  checkStatus: number;
  thisDay: string; // 'YYYY-MM-DDTHH:mm:ssZ' 형식의 UTC 문자열
  startTime: string | null; // 'YYYY-MM-DDTHH:mm:ssZ' 형식의 UTC 문자열 또는 null
  endTime: string | null; // 'YYYY-MM-DDTHH:mm:ssZ' 형식의 UTC 문자열 또는 null
}

// RoutineInfo 인터페이스 수정 (title -> content)
interface RoutineInfo {
  content: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isCenter?: boolean; // 중앙에 표시할지 여부
}

interface WeekGridPageProps {
  selectedDate: Date;
}

const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  const [showGrid, setShowGrid] = useState(true);

  // Store
  const memberId = useStore((s) => s.memberId);
  const schedules: Schedule[] = useStore((s) => s.schedules);
  const fetchSchedules = useStore((s) => s.fetchSchedules);

  // 한 번만 fetch
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return; // 이미 불렀으면 중단
    didFetchRef.current = true;

    console.log("[WeekGridPage] fetchSchedules => memberId:", memberId);
    fetchSchedules(memberId).catch((err) => {
      console.error("[WeekGridPage] fetchSchedules error:", err);
    });
  }, [memberId, fetchSchedules]);

  // --- 주 계산(일요일=0) 로컬 ---
  function getStartOfWeekLocal(date: Date) {
    const dayOfWeek = date.getDay(); // 0=일
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d - dayOfWeek, 0, 0, 0);
  }

  const weekStart = getStartOfWeekLocal(selectedDate);
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.getTime());
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  // 05:00~다음날05:00 (로컬)
  function getGridIndexes(dateObj: Date) {
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    const totalMinutes = (hour - 5) * 60 + min;

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

  // start~end map
  function mapScheduleToCells(
    startStr: string,
    endStr: string,
    dayIndex: number,
    sch: Schedule
  ): { [key: string]: RoutineInfo } {
    const st = parseISO(startStr); // 서버: UTC, parse => 로컬 시각
    const et = parseISO(endStr);

    if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};

    const stIdx = getGridIndexes(st);
    const etIdx = getGridIndexes(et);

    if (stIdx.timeIndex < 0 || etIdx.timeIndex < 0) return {};

    // Calculate duration in minutes
    const durationMinutes = (et.getTime() - st.getTime()) / 60000;
    if (durationMinutes <= 0) return {};

    // Calculate number of 10-minute parts
    const numberOfParts = Math.ceil(durationMinutes / 10);

    // Find the start cell
    let currentTime = new Date(st.getTime());
    const cellsToFill: { [key: string]: RoutineInfo } = {};
    let partsFilled = 0;

    while (partsFilled < numberOfParts) {
      const { timeIndex, partIndex } = getGridIndexes(currentTime);
      if (timeIndex === -1) break;

      const key = `${dayIndex}-${timeIndex}-${partIndex}`;

      // Determine if this part is the center
      const centerPart = Math.floor(numberOfParts / 2);
      const isCenter = partsFilled === centerPart;

      cellsToFill[key] = {
        content: sch.content,
        startTime: st.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: et.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCenter,
      };

      // Move to next 10-minute part
      currentTime.setMinutes(currentTime.getMinutes() + 10);
      partsFilled++;
    }

    return cellsToFill;
  }

  // highlightCells
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  useEffect(() => {
    const newHighlighted: { [key: string]: RoutineInfo } = {};

    weekDates.forEach((wd, dayIndex) => {
      schedules.forEach((sch) => {
        if (!sch.thisDay) return;
        const dayDate = parseISO(sch.thisDay); // => 로컬 시각 변환
        if (
          wd.getFullYear() === dayDate.getFullYear() &&
          wd.getMonth() === dayDate.getMonth() &&
          wd.getDate() === dayDate.getDate()
        ) {
          if (sch.startTime && sch.endTime) {
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex, sch);
            if (partial) {
              Object.assign(newHighlighted, partial);
            }
          }
        }
      });
    });

    setHighlightedCells(newHighlighted);
  }, [schedules, weekDates]);

  const handleConfirmClick = () => {
    setShowGrid(false);
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ position: "relative", height: "700px" }}>
      <WeekDates selectedDate={selectedDate} />

      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          padding: "0px 35px",
          width: "100%",
        }}
      >
        {/* 빈 공간 왼쪽 */}
        <div></div>
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} />

      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <ConfirmButton
          onClick={handleConfirmClick}
          text=" 확인 "
          style={{ width: "74px", height: "42px" }}
        />
      </div>
    </div>
  );
};

export default WeekGridPage;
