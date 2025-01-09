// WeekGrid.tsx

import React from "react";
import "./WeekGrid.css";

// RoutineInfo 인터페이스 확장
interface RoutineInfo {
  content: string;
  startTime: string;
  endTime: string;
  isCenter?: boolean;
}

interface WeekGridProps {
  showGrid: boolean;
  highlightedCells: { [key: string]: RoutineInfo };
}

const WeekGrid: React.FC<WeekGridProps> = ({ showGrid, highlightedCells }) => {
  console.log("[WeekGrid] RENDER => showGrid=", showGrid);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // 5시부터 30분 단위 48칸 => 05:00 ~ 다음날 05:00
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2) + 5;
    const minute = i % 2 === 0 ? "00" : "30";
    const displayHour = (hour % 24).toString().padStart(2, "0");
    return `${displayHour}:${minute}`;
  });

  // 요일별 색상
  const colors = ["#D8EAF6", "#D9F6D8", "#FDEDE5", "#DAEBE5", "#d5dfef", "#fcd8ee", "#ead6fb"];

  return (
    <div className="week-grid-container">
      <div className={`week-grid ${!showGrid ? "hidden-grid-lines" : ""}`}>
        <div className="time-labels">
          {times.map((time, idx) => (
            <div key={idx} className="time-cell">
              {time}
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div key={day} className="day-column">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {[0, 1, 2].map((partIndex) => {
                  const key = `${dayIndex}-${timeIndex}-${partIndex}`;
                  const routine = highlightedCells[key];
                  const selected = !!routine;
                  const color = selected ? colors[dayIndex % colors.length] : "transparent";
                  return (
                    <div
                      key={partIndex}
                      className={`time-cell-part ${selected ? "selected" : ""}`}
                      style={{
                        backgroundColor: selected ? color : "transparent",
                        position: "relative",
                      }}
                    >
                      {/* 루틴 정보 표시 */}
                      {selected && (
                        <div className="routine-info">
                          <strong>{routine.content}</strong>
                          <br />
                          {routine.startTime} - {routine.endTime}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekGrid;
