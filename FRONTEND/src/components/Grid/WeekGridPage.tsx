import React, { useEffect, useState, useMemo } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { parseISO, format, addDays } from "date-fns";
import { useSchedules } from "../../hooks/schedule/useSchedules";
import { Schedule } from "../../store"; // Schedule 타입이 정의되어 있다면

const WeekGridPage: React.FC<{ selectedDate: Date; onPageChange: (page: string) => void }> = ({ selectedDate, onPageChange }) => {
  const [showGrid, setShowGrid] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });
  
  // 예시로 memberId는 하드코딩 (실제에서는 store에서 가져옴)
  const memberId = "12345";
  const { data: schedules = [] } = useSchedules(memberId);

  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  };
  
  const [weekStartDate, setWeekStartDate] = useState(getStartOfWeek(selectedDate));

  useEffect(() => {
    setWeekStartDate(getStartOfWeek(selectedDate));
  }, [selectedDate]);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStartDate, i));
    }
    return dates;
  }, [weekStartDate]);

  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const computeNewCells = (): { [key: string]: any } => {
      if (!schedules || schedules.length === 0) return {};
      const newCells: { [key: string]: any } = {};

      function getGridIndexes(dateObj: Date) {
        const hour = dateObj.getHours();
        const min = dateObj.getMinutes();
        let totalMinutes = (hour - 5) * 60 + min;
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
        const timeIndex = Math.floor(totalMinutes / 30);
        const partIndex = Math.floor((totalMinutes % 30) / 10);
        return { timeIndex, partIndex };
      }

      function mapScheduleToCells(startStr: string, endStr: string, dayIndex: number, sch: any) {
        const st = parseISO(startStr);
        const et = parseISO(endStr);
        if (isNaN(st.getTime()) || isNaN(et.getTime())) return {};
        const stIdx = getGridIndexes(st);
        const etIdx = getGridIndexes(et);
        const cells: { [key: string]: any } = {};
        for (let t = stIdx.timeIndex; t <= etIdx.timeIndex; t++) {
          const pStart = t === stIdx.timeIndex ? stIdx.partIndex : 0;
          const pEnd = t === etIdx.timeIndex ? etIdx.partIndex - 1 : 2;
          for (let p = pStart; p <= pEnd; p++) {
            const key = `${dayIndex}-${t}-${p}`;
            cells[key] = {
              content: sch.content,
              startTime: st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              endTime: et.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          }
        }
        return cells;
      }

      weekDates.forEach((wd, dayIndex) => {
        const wdString = format(wd, "yyyy-MM-dd");
        schedules.forEach((sch: Schedule) => {
          if (!sch.thisDay) return;
          const schDay = format(parseISO(sch.thisDay), "yyyy-MM-dd");
          if (schDay === wdString && sch.startTime && sch.endTime) {
            const cells = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex, sch);
            Object.assign(newCells, cells);
          }
        });
      });
      return newCells;
    };

    const newCells = computeNewCells();
    // 만약 newCells와 highlightedCells가 실제로 다르면 업데이트
    if (JSON.stringify(newCells) !== JSON.stringify(highlightedCells)) {
      setHighlightedCells(newCells);
    }
  }, [schedules, weekDates]); // highlightedCells를 의존성 배열에서 제거

  const handleCellHover = (routine: any | null, e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleConfirmClick = () => {
    setShowGrid(false);
    onPageChange("calendar");
  };

  return (
    <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      <WeekDates selectedDate={weekStartDate} onSelectedDateChange={setWeekStartDate} />
      <div style={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
        <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} onCellHover={handleCellHover} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <ConfirmButton text="확인" onClick={handleConfirmClick} />
      </div>
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
            whiteSpace: "pre-line",
            pointerEvents: "none",
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
