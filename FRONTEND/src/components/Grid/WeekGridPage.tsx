import React, { useEffect, useRef, useState, useMemo } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import { useStore, Schedule } from "../../store";
import { parseISO, format, addDays } from "date-fns";

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

  // [중요] startOfWeek를 구해서 Sunday~Saturday 7일을 배열로
  function getStartOfWeekLocal(date: Date) {
    // 0=Sun
    const dayOfWeek = date.getDay(); 
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    // ex) date가 목요일이면 dayOfWeek=4 => start = date - 4일 => 일요일
    return new Date(y, m, d - dayOfWeek);
  }

  // 주간 날짜(7일)
  const [weekStartDate, setWeekStartDate] = useState(getStartOfWeekLocal(selectedDate));

  // selectedDate 변경 시 => weekStartDate도 새로 계산
  useEffect(() => {
    setWeekStartDate(getStartOfWeekLocal(selectedDate));
  }, [selectedDate]);

  // weekDates: 일요일 ~ 토요일
  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStartDate, i));
    }
    return dates;
  }, [weekStartDate]);

  // 05:00 ~ 다음날05:00 계산
  function getGridIndexes(dateObj: Date) {
    // hour-5 => if <0 => 전날, if >=24 => 다음날
    let hour = dateObj.getHours();
    const min = dateObj.getMinutes();

    // 전날/다음날 처리
    let dayOffset = 0; // 0: same day, -1: previous day, +1: next day
    if (hour < 5) {
      // 05시 이전 => 전날로
      dayOffset = -1;
      hour += 24; // ex) 2시 -> 26시
    }

    let totalMinutes = (hour - 5) * 60 + min;
    if (totalMinutes >= 24 * 60) {
      // 29시 이상 -> 다음날
      dayOffset = +1;
      totalMinutes -= 24 * 60;
    }

    const timeIndex = Math.floor(totalMinutes / 30);
    const remainder = totalMinutes % 30;
    let partIndex = Math.floor(remainder / 10);
    if (partIndex > 2) partIndex = 2;

    return { dayOffset, timeIndex, partIndex };
  }

  // 하나의 스케줄 => 여러 셀
  function mapScheduleToCells(
    startStr: string,
    endStr: string,
    dayIndex: number,
    sch: Schedule
  ): { [key: string]: RoutineInfo } {
    const st = parseISO(startStr);
    const et = parseISO(endStr);
    if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};

    // 스케줄이 역전되면 무시
    if (et <= st) return {};

    const result: { [key: string]: RoutineInfo } = {};
    let currentTime = new Date(st.getTime());
    const durationMinutes = (et.getTime() - st.getTime()) / 60000;
    const totalParts = Math.floor(durationMinutes / 10);
    let count = 0;

    while (count < totalParts) {
      const { dayOffset, timeIndex, partIndex } = getGridIndexes(currentTime);
      if (timeIndex === -1) {
        // 05시 이전 => timeIndex=-1로 할 수도 있으나
        // 위 로직에서 -1 => skip
      }
      if (timeIndex >= 0 && timeIndex < 48) {
        // valid grid range
        const actualDayIndex = dayIndex + dayOffset; 
        // dayOffset이 -1이면 전날, +1이면 다음날
        if (actualDayIndex >= 0 && actualDayIndex < 7) {
          // 같은 주 안에 있으면 칠함
          const key = `${actualDayIndex}-${timeIndex}-${partIndex}`;
          result[key] = {
            content: sch.content,
            startTime: st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            endTime: et.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
      }
      // 10분 후
      currentTime.setMinutes(currentTime.getMinutes() + 10);
      count++;
    }
    return result;
  }

  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  // 주간 전체 스케줄 => gridCells
  useEffect(() => {
    const newCells: { [key: string]: RoutineInfo } = {};

    // weekDates[dayIndex], dayIndex=0..6
    weekDates.forEach((wd, dayIndex) => {
      // "YYYY-MM-DD"
      const wdString = format(wd, "yyyy-MM-dd");
      schedules.forEach((sch) => {
        if (!sch.thisDay) return;
        // sch.thisDay => "YYYY-MM-DDT00:00:00.000Z"
        const dayPart = format(parseISO(sch.thisDay), "yyyy-MM-dd");
        if (dayPart === wdString) {
          // map start~end
          if (sch.startTime && sch.endTime) {
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex, sch);
            Object.assign(newCells, partial);
          }
        }
      });
    });

    setHighlightedCells(newCells);
  }, [schedules, weekDates]);

  // WeekGrid 마우스 호버 툴팁
  const handleCellHover = (
    routine: RoutineInfo | null,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!routine) {
      setTooltip({ ...tooltip, visible: false });
      return;
    }
    setTooltip({
      visible: true,
      x: e.clientX + 10,
      y: e.clientY + 10,
      content: `${routine.content}\n${routine.startTime} ~ ${routine.endTime}`,
    });
  };

  return (
    <div style={{ position: "relative", height: "700px" }}>
      {/* 주간 날짜 헤더 */}
      <WeekDates 
        selectedDate={weekStartDate} 
        onSelectedDateChange={(newDate) => {
          // 여기서 weekStartDate나 selectedDate를 갱신하면
          // 일주일 뷰가 바뀜 + 왼쪽 투두리스트도 반영 가능
          setWeekStartDate(getStartOfWeekLocal(newDate));
        }}
      />

      {/* 요일 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "5px 0px",
          marginLeft: "80px",
          marginRight: "10px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            style={{
              width: "100px",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* WeekGrid */}
      <WeekGrid
        showGrid={showGrid}
        highlightedCells={highlightedCells}
        onCellHover={handleCellHover}
      />

      {/* 툴팁 */}
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
