import React, { useState } from 'react';
import './WeekGrid.css';

interface DragStart {
  dayIndex: number;
  timeIndex: number;
  partIndex: number;
  newState: boolean; 
}

const WeekGrid: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = (Math.floor(i / 2) + 5) % 24;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const [selectedCells, setSelectedCells] = useState<{ [key: string]: boolean }>({});
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const handleMouseDown = (dayIndex: number, timeIndex: number, partIndex: number) => {
    const key = `${dayIndex}-${timeIndex}-${partIndex}`;
    const newState = !selectedCells[key]; // Toggle the current state
    setDragging(true);
    setDragStart({ dayIndex, timeIndex, partIndex, newState });
    setSelectedCells(prevState => ({ ...prevState, [key]: newState }));
};

const handleMouseEnter = (dayIndex: number, timeIndex: number, partIndex: number) => {
  if (dragging && dragStart) {
      const startDayIndex = dragStart.dayIndex;
      if (startDayIndex !== dayIndex) return; // Ensure dragging within the same column

      const rangeStart = Math.min(dragStart.timeIndex, timeIndex);
      const rangeEnd = Math.max(dragStart.timeIndex, timeIndex);
      const newSelectedCells = {...selectedCells};

      const isLeftToRight = timeIndex > dragStart.timeIndex;

      for (let index = rangeStart; index <= rangeEnd; index++) {
          let startPartIndex = 0;
          let endPartIndex = 2;

          if (index === timeIndex) {
              // If we are on the line where the mouse currently is
              if (isLeftToRight) {
                  startPartIndex = 0;
                  endPartIndex = partIndex;
              } else {
                  startPartIndex = partIndex;
                  endPartIndex = 2;
              }
          }

          if (index === dragStart.timeIndex) {
              // If we are on the line where the drag started
              if (isLeftToRight) {
                  startPartIndex = dragStart.partIndex;
                  endPartIndex = index === timeIndex ? partIndex : 2;  // Adjust end index if on the same line as current mouse position
              } else {
                  startPartIndex = index === timeIndex ? partIndex : 0;
                  endPartIndex = dragStart.partIndex;
              }
          }

          if (!isLeftToRight && index > dragStart.timeIndex && index < timeIndex) {
              // For all lines between the drag start and the current line when dragging right to left
              startPartIndex = 0;
              endPartIndex = 2;
          }

          for (let part = startPartIndex; part <= endPartIndex; part++) {
              const key = `${dayIndex}-${index}-${part}`;
              newSelectedCells[key] = dragStart.newState; // Apply the state decided at the start of the drag
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
      <div className="week-grid">
        <div className="time-labels">
          {times.map((time, index) => (
            <div key={index} className="time-cell">{time}</div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={day} className="day-column">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {[0, 1, 2].map(partIndex => (
                  <div key={partIndex}
                       className={`time-cell-part ${selectedCells[`${dayIndex}-${timeIndex}-${partIndex}`] ? 'selected' : ''}`}
                       onMouseDown={() => handleMouseDown(dayIndex, timeIndex, partIndex)}
                       onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex, partIndex)}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekGrid;
