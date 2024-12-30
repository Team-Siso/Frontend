import React, { useEffect, useState } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore } from "../../store";
import { parseISO } from "date-fns";

interface WeekGridPageProps {
  selectedDate: Date; // 달력에서 선택된 (로컬) Date
}

const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  const [showGrid, setShowGrid] = useState(true);
  const schedules = useStore((state) => state.schedules);

  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: boolean }>({});

  const handleConfirmClick = () => {
    setShowGrid(false);
  };

  // === 주 시작 계산 (일요일 0) ===
  const getStartOfWeek = (date: Date) => {
    // JS date.getDay(): 0=일,1=월,...6=토
    const dayOfWeek = date.getDay(); // 0=일
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    // date - dayOfWeek → 일요일
    newDate.setDate(newDate.getDate() - dayOfWeek);
    return newDate;
  };

  // weekDates[0] = 일요일
  const weekStart = getStartOfWeek(selectedDate);
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  // 요일 이름
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // === 시간을 "05:00~다음날05:00" 그리드 인덱스로 변환 ===
  const getGridIndexes = (dateObj: Date) => {
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    // 5시 = 0번 timeIndex
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
  };

  // === 스케줄 -> dayIndex, timeIndex, partIndex
  const mapScheduleToCells = (stISO: string, etISO: string, dayIndex: number) => {
    const st = parseISO(stISO);
    const et = parseISO(etISO);
    const stIdx = getGridIndexes(st);
    const etIdx = getGridIndexes(et);
    if (stIdx.timeIndex < 0 || etIdx.timeIndex < 0) return {};

    const newCells: { [key: string]: boolean } = {};
    const minT = Math.min(stIdx.timeIndex, etIdx.timeIndex);
    const maxT = Math.max(stIdx.timeIndex, etIdx.timeIndex);

    for (let t = minT; t <= maxT; t++) {
      const startPart = t === minT ? stIdx.partIndex : 0;
      const endPart = t === maxT ? etIdx.partIndex : 2;
      for (let p = startPart; p <= endPart; p++) {
        const key = `${dayIndex}-${t}-${p}`;
        newCells[key] = true;
      }
    }
    return newCells;
  };

  // === schedules -> highlightedCells
  useEffect(() => {
    const newHighlighted: { [key: string]: boolean } = {};

    // dayIndex=0=>일,1=>월,...6=>토
    weekDates.forEach((dateObj, dayIndex) => {
      // "YYYY-MM-DD"
      const y = dateObj.getFullYear();
      const m = dateObj.getMonth();
      const d = dateObj.getDate();

      // 이 날짜를 가진 스케줄만
      schedules.forEach((sch) => {
        if (!sch.thisDay) return;
        // sch.thisDay = "YYYY-MM-DD"
        // 비교
        const [sy, sm, sd] = sch.thisDay.split("-");
        if (Number(sy) === y && Number(sm) - 1 === m && Number(sd) === d) {
          if (sch.startTime && sch.endTime) {
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex);
            Object.keys(partial).forEach((k) => {
              newHighlighted[k] = true;
            });
          }
        }
      });
    });

    setHighlightedCells(newHighlighted);
  }, [schedules, selectedDate]);

  return (
    <div style={{ position: "relative", height: "700px" }}>
      <WeekDates selectedDate={selectedDate} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: "0px 35px",
          width: "100%",
        }}
      >
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              paddingLeft: "95px",
              width: "calc(100% / 7)",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} />

      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          right: "20px",
        }}
      >
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
