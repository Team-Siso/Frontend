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
  function mapScheduleToCells(startStr: string, endStr: string, dayIndex: number, sch: Schedule): { [key: string]: RoutineInfo } {
    const st = parseISO(startStr); // 서버: UTC, parse => 로컬 시각
    const et = parseISO(endStr);

    const stIdx = getGridIndexes(st);
    const etIdx = getGridIndexes(et);
    if (stIdx.timeIndex < 0 || etIdx.timeIndex < 0) return {};

    const minT = Math.min(stIdx.timeIndex, etIdx.timeIndex);
    const maxT = Math.max(stIdx.timeIndex, etIdx.timeIndex);
    const newCells: { [key: string]: RoutineInfo } = {};

    // 총 셀 개수
    const totalParts = (maxT - minT) * 3 - stIdx.partIndex + etIdx.partIndex;

    // 중앙 셀 계산
    const centerPart = Math.floor(totalParts / 2);
    let currentPart = 0;

    for (let t = minT; t < maxT; t++) {
      const startPart = t === minT ? stIdx.partIndex : 0;
      const endPart = 2;
      for (let p = startPart; p <= endPart; p++) {
        const key = `${dayIndex}-${t}-${p}`;
        const isCenter = currentPart === centerPart;
        newCells[key] = {
          content: sch.content,
          startTime: sch.startTime?.slice(11, 16) || "",
          endTime: sch.endTime?.slice(11, 16) || "",
          isCenter,
        };
        currentPart++;
      }
    }

    return newCells;
  }

  // highlightCells
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: RoutineInfo }>({});

  useEffect(() => {
    const newHighlighted: { [key: string]: RoutineInfo } = {};

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
            const partial = mapScheduleToCells(sch.startTime, sch.endTime, dayIndex, sch);
            if (partial) {
              Object.keys(partial).forEach((k) => {
                newHighlighted[k] = partial[k];
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
