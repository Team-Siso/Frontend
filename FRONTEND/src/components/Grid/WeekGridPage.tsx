import React, { useState } from 'react';
import WeekDates from '../Calendar/WeekDates';
import WeekGrid from './WeekGrid'; 
import './WeekGrid.css'; 
import ConfirmButton from '../ConfirmButton';

interface WeekGridPageProps {
  selectedDate: Date; // 선택된 날짜를 나타내는 prop
}

// 주간 날짜와 시간표, 확인 버튼을 렌더링하는 페이지 컴포넌트
const WeekGridPage: React.FC<WeekGridPageProps> = ({ selectedDate }) => {
  // 주간 그리드의 표시 여부 제어
  const [showGrid, setShowGrid] = useState(true);

  // 주간 헤더에 표시할 요일 이름 배열
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleConfirmClick = () => {
    setShowGrid(false); // WeekGrid 컴포넌트 숨김
  };

  return (
    <div style={{ position: 'relative', height: '700px' }}>
      {/* 선택된 날짜에 해당하는 주간 날짜를 표시 */}
      <WeekDates selectedDate={selectedDate} />
      
      {/* 요일 이름을 화면 상단에 표시 */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-evenly', // 요일 간격을 일정하게 배치
          padding: '0px 35px', 
          width: '100%'
        }}
      >
        {daysOfWeek.map(day => (
          <div 
            key={day} // 각 요일의 고유 키 (식별자 역할)
            className={`day day-${day}`} // 기본 클래스와 요일별 동적 클래스 적용
            style={{ 
              paddingLeft: '95px',
              width: 'calc(100% / 7)' // 각 요일의 너비를 7등분하여 분배
            }}
          >
            {day} {/* 요일 이름 출력 */}
          </div>
        ))}
      </div>
      
      {/* 주간 그리드 컴포넌트 */}
      <WeekGrid showGrid={showGrid} /> {/* showGrid 상태에 따라 그리드 표시 여부 결정 */}
      
      {/* 확인 버튼: 화면 하단 우측에 위치 */}
      <div 
        style={{ 
          position: 'absolute',
          bottom: '-20px', 
          right: '20px' 
        }}
      >
        <ConfirmButton
          onClick={handleConfirmClick} // 버튼 클릭 시 실행되는 핸들러
          text=" 확인 " // 버튼에 표시할 텍스트
          style={{ 
            width: '74px',
            height: '42px'
          }}
        />
      </div>
    </div>
  );
};

export default WeekGridPage;
