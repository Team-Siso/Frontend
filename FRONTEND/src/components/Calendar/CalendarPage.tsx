import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';
import WeekGridPage from '../Grid/WeekGridPage';
import ConfirmButton from '../ConfirmButton';
import Toggle from '../Toggle';

const CalendarPage = ({ onPageChange }) => {
  const [view, setView] = useState('calendar');

  const handleToggleChange = (isWeekGrid) => {
    setView(isWeekGrid ? 'weekGrid' : 'calendar');
  };

  const handleConfirmClick = () => {
    console.log('FixGrid button clicked');
    if (typeof onPageChange === 'function') {
      onPageChange('fixGrid');
    } else {
      console.error('onPageChange is not a function');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Toggle
          id="view-toggle"
          onToggle={handleToggleChange}
        />
      </div>
      {view === 'weekGrid' ? <WeekGridPage /> : <CustomCalendar />}
      {view === 'calendar' &&
        <ConfirmButton onClick={handleConfirmClick} text="고정 루틴 관리하기" />
      }
    </div>
  );
};

export default CalendarPage;
