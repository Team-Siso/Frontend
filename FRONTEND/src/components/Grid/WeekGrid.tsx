import React, { useState } from 'react';
import './WeekGrid.css';

interface WeekGridProps {
  showGrid: boolean;
}

const WeekGrid: React.FC<WeekGridProps> = ({ showGrid }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = (Math.floor(i / 2) + 5) % 24; // 5시부터 시작하고 24시간 주기로 반복
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const colors = ['#D8EAF6', '#D9F6D8', '#FDEDE5', '#DAEBE5', '#d5dfef', '#fcd8ee', '#ead6fb'];

  const [selectedCells, setSelectedCells] = useState<{ [key: string]: boolean }>({});
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    dayIndex: number;
    timeIndex: number;
    partIndex: number;
    newState: boolean;
  } | null>(null);

  const handleMouseDown = (dayIndex: number, timeIndex: number, partIndex: number) => {
    const key = `${dayIndex}-${timeIndex}-${partIndex}`;
    const newState = !selectedCells[key]; // 현재 상태 토글
    setDragging(true);
    setDragStart({ dayIndex, timeIndex, partIndex, newState });
    setSelectedCells((prevState) => ({ ...prevState, [key]: newState }));
  };

  const handleMouseEnter = (dayIndex: number, timeIndex: number, partIndex: number) => {
    if (dragging && dragStart) {
      const startDayIndex = dragStart.dayIndex;
      if (startDayIndex !== dayIndex) return; // 같은 열에서만 드래그

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
            newSelectedCells[key] = dragStart.newState; // 드래그 시작 시 결정된 상태 적용
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

  return (
    <div className="week-grid-container" onMouseUp={handleMouseUp}>
      <div className={`week-grid ${!showGrid ? 'hidden-grid-lines' : ''}`}>
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
                  const key = `${dayIndex}-${timeIndex}-${partIndex}`;
                  const isSelected = selectedCells[key];
                  const color = colors[dayIndex % colors.length]; // 요일별 색상 선택
                  return (
                    <div
                      key={partIndex}
                      className={`time-cell-part ${isSelected ? 'selected' : ''}`}
                      onMouseDown={() => handleMouseDown(dayIndex, timeIndex, partIndex)}
                      onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex, partIndex)}
                      style={{ backgroundColor: isSelected ? color : 'transparent' }}
                    ></div>
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
