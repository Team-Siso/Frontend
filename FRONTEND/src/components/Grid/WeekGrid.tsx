import React from "react";
import "./WeekGrid.css";

interface RoutineInfo {
  content: string;
  startTime: string;
  endTime: string;
  isCenter?: boolean;
}

interface WeekGridProps {
  showGrid: boolean;
  highlightedCells: { [key: string]: RoutineInfo };
  onCellHover?: (
    routine: RoutineInfo | null,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

const WeekGrid: React.FC<WeekGridProps> = ({
  showGrid,
  highlightedCells,
  onCellHover
}) => {
  console.log("[WeekGrid] RENDER => showGrid=", showGrid);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2) + 5;
    const minute = i % 2 === 0 ? "00" : "30";
    const displayHour = (hour % 24).toString().padStart(2, "0");
    return `${displayHour}:${minute}`;
  });

  // 색상
  const colors = ["#D8EAF6", "#D9F6D8", "#FDEDE5", "#DAEBE5", "#d5dfef", "#fcd8ee", "#ead6fb"];

  return (
    <div className="week-grid-container">
      <div className={`week-grid ${!showGrid ? "hidden-grid-lines" : ""}`}>
        {/* 왼쪽 시간 라벨 */}
        <div className="time-labels">
          {times.map((time, idx) => (
            <div key={idx} className="time-cell">
              {time}
            </div>
          ))}
        </div>

        {/* 7일 칼럼 */}
        {days.map((day, dayIndex) => (
          <div key={day} className="day-column">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {[0,1,2].map((partIndex) => {
                  const cellKey = `${dayIndex}-${timeIndex}-${partIndex}`;
                  const routine = highlightedCells[cellKey];
                  const bgColor = routine ? colors[dayIndex % colors.length] : "transparent";

                  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover && routine) onCellHover(routine, e);
                  };
                  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover) onCellHover(null, e);
                  };
                  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover && routine) onCellHover(routine, e);
                  };

                  return (
                    <div
                      key={partIndex}
                      className="time-cell-part"
                      style={{ backgroundColor: bgColor }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      {/* no text, just tooltip */}
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
