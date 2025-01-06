import React, { useEffect, useRef, useState } from "react";
import WeekDates from "../Calendar/WeekDates";
import WeekGrid from "./WeekGrid";
import "./WeekGrid.css";
import ConfirmButton from "../ConfirmButton";
import { useStore } from "../../store";
import { parseISO } from "date-fns";

interface WeekGridPageProps {
  selectedDate: Date;
}

const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  const [showGrid, setShowGrid] = useState(true);

  // Store
  const memberId = useStore((s) => s.memberId);
  const schedules = useStore((s) => s.schedules);
  const fetchSchedules = useStore((s) => s.fetchSchedules);

  // 한 번만 fetch
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!memberId) return;
    if (didFetchRef.current) return; // 이미 불렀으면 중단
    didFetchRef.current = true;

    console.log("[WeekGridPage] fetchSchedules => memberId:", memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchSchedules(memberId); 
  }, [memberId /*, fetchSchedules */]);

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
  function mapScheduleToCells(startStr: string, endStr: string, dayIndex: number) {
    const st = parseISO(startStr); // 서버: UTC, parse => 로컬 시각
    const et = parseISO(endStr);

    const stIdx = getGridIndexes(st);
    const etIdx = getGridIndexes(et);
    if (stIdx.timeIndex < 0 || etIdx.timeIndex < 0) return {};

    const minT = Math.min(stIdx.timeIndex, etIdx.timeIndex);
    const maxT = Math.max(stIdx.timeIndex, etIdx.timeIndex);
    const newCells: { [key: string]: boolean } = {};

    for (let t = minT; t < maxT; t++) {
      const startPart = t === minT ? stIdx.partIndex : 0;
      let endPart = 2;
      if (t + 1 === maxT) {
        // 마지막
        if (etIdx.partIndex === 0) {
          endPart = 2;
        } else {
          endPart = etIdx.partIndex - 1;
        }
        if (endPart < 0) continue;
      }
      for (let p = startPart; p <= endPart; p++) {
        const key = `${dayIndex}-${t}-${p}`;
        newCells[key] = true;
      }
    }
    return newCells;
  }

  // highlightCells
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newHighlighted: { [key: string]: boolean } = {};

    weekDates.forEach((wd, dayIndex) => {
      const wy = wd.getFullYear();
      const wm = wd.getMonth();
      const wday = wd.getDate();

      schedules.forEach((sch) => {
        if (!sch.thisDay) return;
        const dayDate = parseISO(sch.thisDay); // => 로컬 시각 변환
        const sy = dayDate.getFullYear();
        const sm = dayDate.getMonth();
        const sd = dayDate.getDate();
        if (wy === sy && wm === sm && wday === sd) {
          if (sch.startTime && sch.endTime) {
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex);
            if (partial) {
              Object.keys(partial).forEach((k) => {
                newHighlighted[k] = true;
              });
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

      <div style={{ display: "flex", justifyContent: "space-evenly", padding: "0px 35px", width: "100%" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ paddingLeft: "95px", width: "calc(100% / 7)" }}>
            {day}
          </div>
        ))}
      </div>

      <WeekGrid showGrid={showGrid} highlightedCells={highlightedCells} />

      <div style={{ position: "absolute", bottom: "-20px", right: "20px" }}>
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
