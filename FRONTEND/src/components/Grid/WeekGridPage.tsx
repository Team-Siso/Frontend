// WeekGridPage.tsx

import React, { useEffect, useRef, useState, useMemo } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore, Schedule } from "../../store";
import { parseISO, format } from "date-fns";

interface RoutineInfo {
  content: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isCenter?: boolean;
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

  const didFetchRef = useRef(false);

  // ---------------------------------------
  // (1) 처음에 전체 스케줄 불러오기
  // ---------------------------------------
  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return; // 이미 호출했다면 재호출 방지
    didFetchRef.current = true;

    fetchSchedules(memberId).catch((err) => {
      console.error("[WeekGridPage] fetchSchedules error:", err);
    });
  }, [memberId, fetchSchedules]);

  // ---------------------------------------
  // 주(Week) 날짜 계산
  // ---------------------------------------
  function getStartOfWeekLocal(date: Date) {
    const dayOfWeek = date.getDay(); // 0=일요일
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d - dayOfWeek);
  }

  // ★ weekDates를 memoization 해서 불필요한 재렌더링을 방지
  const weekDates = useMemo(() => {
    const start = getStartOfWeekLocal(selectedDate);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start.getTime());
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  // ---------------------------------------
  // 05:00~다음날05:00 사이에 매핑하기 위한 헬퍼
  // ---------------------------------------
  function getGridIndexes(dateObj: Date) {
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    // 05:00 기준으로 0분이라 가정
    const totalMinutes = (hour - 5) * 60 + min;

    // 05:00 이전이거나 익일 05:00 이후면 맵핑하지 않음
    if (totalMinutes < 0 || totalMinutes >= 24 * 60) {
      return { timeIndex: -1, partIndex: 0 };
    }
    const base30 = Math.floor(totalMinutes / 30); // 30분 단위
    const remainder = totalMinutes % 30;
    const timeIndex = base30;
    let partIndex = Math.floor(remainder / 10); // 10분 단위
    if (partIndex > 2) partIndex = 2;
    return { timeIndex, partIndex };
  }

  // ---------------------------------------
  // 스케줄 하나(start~end)를 여러 셀에 매핑
  // ---------------------------------------
  function mapScheduleToCells(
    startStr: string,
    endStr: string,
    dayIndex: number,
    sch: Schedule
  ): { [key: string]: RoutineInfo } {
    const st = parseISO(startStr); // 로컬 시각으로 파싱
    const et = parseISO(endStr);

    if (isNaN(st.getTime()) || isNaN(et.getTime()) || et <= st) return {};

    const cellsToFill: { [key: string]: RoutineInfo } = {};
    let currentTime = new Date(st.getTime());
    const durationMinutes = (et.getTime() - st.getTime()) / 60000;
    const numberOfParts = Math.floor(durationMinutes / 10); // 변경: Math.floor 사용
    const remainder = durationMinutes % 10;
    const centerPart = Math.floor(numberOfParts / 2);
    let partsFilled = 0;

    while (partsFilled < numberOfParts || (partsFilled === numberOfParts && remainder > 0)) {
      const { timeIndex, partIndex } = getGridIndexes(currentTime);
      if (timeIndex === -1) break; // 05:00~익일05:00 범위 밖이면 중단

      const key = `${dayIndex}-${timeIndex}-${partIndex}`;
      const isCenter = partsFilled === centerPart;

      cellsToFill[key] = {
        content: sch.content,
        startTime: st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        endTime: et.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCenter,
      };

      // 다음 10분으로 이동
      currentTime.setMinutes(currentTime.getMinutes() + 10);
      partsFilled++;
    }

    return cellsToFill;
  }

  // ---------------------------------------
  // highlightCells 계산
  // ---------------------------------------
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  useEffect(() => {
    const newHighlighted: { [key: string]: RoutineInfo } = {};

    // 주간에 해당하는 날짜들(weekDates)을 순회
    weekDates.forEach((wd, dayIndex) => {
      // 이 날짜를 "yyyy-MM-dd"로
      const wdString = format(wd, "yyyy-MM-dd");

      schedules.forEach((sch) => {
        if (!sch.thisDay) return;

        // sch.thisDay = "YYYY-MM-DDT00:00:00" 형태라면 parseISO로 안전하게 파싱 후 날짜 부분만 추출
        const scheduleDate = parseISO(sch.thisDay);
        if (isNaN(scheduleDate.getTime())) return;

        // "yyyy-MM-dd" 형태로
        const scheduleDay = format(scheduleDate, "yyyy-MM-dd");

        // 날짜가 같은 스케줄만 매핑
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

  // ---------------------------------------
  // "확인" 버튼
  // ---------------------------------------
  const handleConfirmClick = () => {
    setShowGrid(false);
    // 필요하다면 다른 페이지로 이동 혹은 다른 로직
  };

  return (
    <div style={{ position: "relative", height: "700px" }}>
      {/* 주간 날짜 헤더 */}
      <WeekDates selectedDate={selectedDate} />

      {/* 요일 헤더 (Sun ~ Sat) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          padding: "0px 35px",
          width: "100%",
        }}
      >
        <div></div>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      {/* 실제 WeekGrid 표시 */}
      <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} />

      {/* 하단 버튼 */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <ConfirmButton
          onClick={handleConfirmClick}
          text="확인"
          style={{ width: "74px", height: "42px" }}
        />
      </div>
    </div>
  );
};

export default WeekGridPage;
