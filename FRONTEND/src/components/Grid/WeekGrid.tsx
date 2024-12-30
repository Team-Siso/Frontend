import React, { useState } from "react";
import "./WeekGrid.css";

interface WeekGridProps {
  showGrid: boolean; // 그리드 라인 표시 여부
  highlightedCells: { [key: string]: boolean }; // 저장된 일정 데이터
}

const WeekGrid: React.FC<WeekGridProps> = ({ showGrid, highlightedCells }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // 요일 배열
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = (Math.floor(i / 2) + 5) % 24; // 5시부터 시작
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const colors = ["#D8EAF6", "#D9F6D8", "#FDEDE5", "#DAEBE5", "#d5dfef", "#fcd8ee", "#ead6fb"];

  const [selectedCells, setSelectedCells] = useState<{ [key: string]: boolean }>({});
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    dayIndex: number;
    timeIndex: number;
    partIndex: number;
    newState: boolean;
  } | null>(null);

  const handleMouseDown = (
    dayIndex: number,
    timeIndex: number,
    partIndex: number
  ) => {
    const key = `${dayIndex}-${timeIndex}-${partIndex}`;
    const newState = !selectedCells[key];
    setDragging(true);
    setDragStart({ dayIndex, timeIndex, partIndex, newState });
    setSelectedCells((prevState) => ({ ...prevState, [key]: newState }));
  };

  const handleMouseEnter = (
    dayIndex: number,
    timeIndex: number,
    partIndex: number
  ) => {
    if (dragging && dragStart) {
      if (dragStart.dayIndex !== dayIndex) return;

      const rangeStart = Math.min(dragStart.timeIndex, timeIndex);
      const rangeEnd = Math.max(dragStart.timeIndex, timeIndex);

      const newSelectedCells = { ...selectedCells };
      for (let index = rangeStart; index <= rangeEnd; index++) {
        for (let part = 0; part <= 2; part++) {
          const key = `${dayIndex}-${index}-${part}`;
          if (
            (index === dragStart.timeIndex && part >= dragStart.partIndex) ||
            (index === timeIndex && part <= partIndex) ||
            (index !== dragStart.timeIndex && index !== timeIndex)
          ) {
            newSelectedCells[key] = dragStart.newState;
          }
        }
      }
      setSelectedCells(newSelectedCells);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const isCellSelected = (
    dayIndex: number,
    timeIndex: number,
    partIndex: number
  ) => {
    const key = `${dayIndex}-${timeIndex}-${partIndex}`;
    return highlightedCells[key] || selectedCells[key] || false;
  };

  return (
    <div className="week-grid-container" onMouseUp={handleMouseUp}>
      <div className={`week-grid ${!showGrid ? "hidden-grid-lines" : ""}`}>
        <div className="time-labels">
          {times.map((time, index) => (
            <div key={index} className="time-cell">
              {time}
            </div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={day} className="day-column">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {[0, 1, 2].map((partIndex) => {
                  const selected = isCellSelected(dayIndex, timeIndex, partIndex);
                  const color = colors[dayIndex % colors.length];
                  return (
                    <div
                      key={partIndex}
                      className={`time-cell-part ${selected ? "selected" : ""}`}
                      onMouseDown={() => handleMouseDown(dayIndex, timeIndex, partIndex)}
                      onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex, partIndex)}
                      style={{
                        backgroundColor: selected ? color : "transparent",
                      }}
                    />
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
