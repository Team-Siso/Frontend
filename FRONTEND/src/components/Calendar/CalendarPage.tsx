import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';
import WeekGridPage from '../Grid/WeekGridPage';
import ConfirmButton from '../ConfirmButton';  // ConfirmButton 컴포넌트 임포트

const CalendarPage = ({ onPageChange }) => {
  const [view, setView] = useState('calendar');

  const handleToggleChange = (isWeekGrid) => {
    setView(isWeekGrid ? 'weekGrid' : 'calendar');
  };

  // 이 함수는 '고정 루틴 관리하기' 버튼을 클릭했을 때 호출되며,
  // 부모 컴포넌트인 MainPage로 'fixGrid' 페이지로의 전환을 요청합니다.
  const handleConfirmClick = () => {
    console.log('FixGrid button clicked'); // 버튼 클릭 로그
    onPageChange('fixGrid');
  };
  
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {view === 'calendar' ? 
        <CustomCalendar onToggleChange={handleToggleChange} /> : 
        <WeekGridPage />}
      <ConfirmButton onClick={handleConfirmClick} text="고정 루틴 관리하기" /> 
    </div>
  );
};

export default CalendarPage;
