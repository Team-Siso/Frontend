import React, { useState } from 'react';
import WeekDates from '../Calendar/WeekDates';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

interface WeekGridPageProps {
  selectedDate: Date;
}

const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  const [showGrid, setShowGrid] = useState(true);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleConfirmClick = () => {
    console.log('Confirm button clicked');
    setShowGrid(false);  // 그리드 숨기기
  };

  return (
    <div style={{ position: 'relative', height: '700px' }}>
      <WeekDates selectedDate={selectedDate} />
      <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '0px 35px', width: '100%' }}>
        {daysOfWeek.map(day => (
          <div key={day} className={`day day-${day}`} style={{ paddingLeft: '95px', width: 'calc(100% / 7)' }}>
            {day}
          </div>
        ))}
      </div>
      <WeekGrid showGrid={showGrid} />
      <div style={{ position: 'absolute', bottom: '-20px', right: '20px' }}>
        <ConfirmButton
          onClick={handleConfirmClick}
          text=" 확인 "
          style={{ width: '74px', height: '42px' }}
        />
      </div>
    </div>
  );
};

export default WeekGridPage;
