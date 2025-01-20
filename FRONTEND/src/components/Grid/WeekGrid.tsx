import React from "react";
import "./WeekGrid.css";

// 루틴 정보 (FixGridPage에서 넘겨주는 highlightedCells 의 value)
interface RoutineInfo {
  content: string;
  startTime: string;
  endTime: string;
  isCenter?: boolean; // 지금은 사용X
}

interface WeekGridProps {
  showGrid: boolean;
  highlightedCells: { [key: string]: RoutineInfo };
  // ★ 추가: 마우스 호버 이벤트 콜백
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
  // 5시부터 30분 간격 48칸 => 05:00 ~ 다음날 05:00
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2) + 5;
    const minute = i % 2 === 0 ? "00" : "30";
    const displayHour = (hour % 24).toString().padStart(2, "0");
    return `${displayHour}:${minute}`;
  });

  // 요일별 색상 (임의)
  const colors = ["#D8EAF6", "#D9F6D8", "#FDEDE5", "#DAEBE5", "#d5dfef", "#fcd8ee", "#ead6fb"];

  return (
    <div className="week-grid-container">
      <div className={`week-grid ${!showGrid ? "hidden-grid-lines" : ""}`}>
        {/* 좌측 시간 라벨 */}
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
            {/* 48줄(30분 간격) */}
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {/* 각 cell 안에 partIndex=0..2 */}
                {[0, 1, 2].map((partIndex) => {
                  const cellKey = `${dayIndex}-${timeIndex}-${partIndex}`;
                  const routine = highlightedCells[cellKey];
                  const isSelected = !!routine;

                  // 색상
                  const bgColor = isSelected ? colors[dayIndex % colors.length] : "transparent";

                  // 마우스 이벤트
                  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover && routine) {
                      onCellHover(routine, e);
                    }
                  };
                  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover) {
                      onCellHover(null, e); // null => 툴팁 닫기
                    }
                  };
                  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (onCellHover && routine) {
                      onCellHover(routine, e);
                    }
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
                      {/* 루틴 이름은 그리드 위에 표시 X -> Tooltip으로만 표시 */}
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
