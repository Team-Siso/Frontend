import React, { useEffect, useState, useMemo } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { parseISO, format, addDays } from "date-fns";
import { useSchedules } from "../../hooks/schedule/useSchedules";
import { useStore, Schedule } from "../../store"; 

const FixGridPage: React.FC<{ onPageChange: (page: string) => void }> = ({ onPageChange }) => {

  const [showGrid, setShowGrid] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });

  // Zustand 스토어에서 memberId 가져오기 (숫자형이라면 문자열로 변환)
  const memberId = useStore((s) => s.memberId);
  const memberIdString = memberId ? memberId.toString() : "";

  // React Query 훅을 사용해 schedules 데이터를 가져옴 (memberId가 있을 때만)
  const { data: schedules = [] } = useSchedules(memberIdString);

  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  };
  const [weekStartDate, setWeekStartDate] = useState(getStartOfWeek(new Date()));

  // 초기 마운트 시 weekStartDate를 설정 (한 번만 실행)
  useEffect(() => {
    setWeekStartDate(getStartOfWeek(new Date()));
  }, []);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStartDate, i));
    }
    return dates;
  }, [weekStartDate]);

  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // 만약 schedules가 없거나 비어 있다면, 기존 상태가 비어있지 않으면 초기화
    if (!schedules || schedules.length === 0) {
      if (Object.keys(highlightedCells).length !== 0) {
        setHighlightedCells({});
      }
      return;
    }
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

    // 조건: 기존 highlightedCells와 새로 계산한 newCells가 다를 때만 상태 업데이트
    if (JSON.stringify(newCells) !== JSON.stringify(highlightedCells)) {
      setHighlightedCells(newCells);
    }
  }, [schedules, weekDates, highlightedCells]);

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

export default FixGridPage;
