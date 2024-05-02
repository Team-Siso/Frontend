import React from 'react';
import './WeekGrid.css';

const WeekGrid: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 2) + 5}:${i % 2 === 0 ? '00' : '30'}`);

  return (
    <div className="week-grid-container">
      <div className="week-grid">
        <div className="time-labels">
          {times.map((time, index) => (
            <div key={index} className="time-cell">{time}</div>
          ))}
        </div>
        {days.map(day => (
          <div key={day} className="day-column">
            {times.map((_, index) => (
              <div key={index} className="time-cell"></div> // 격자 안은 비워둠
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekGrid;
