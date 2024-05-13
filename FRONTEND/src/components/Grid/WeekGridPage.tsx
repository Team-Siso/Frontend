import React from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

const WeekGridPage = () => {
  const handleConfirmClick = () => {
    console.log('Confirm button clicked');
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <WeekGrid />
      <div style={{ position: 'absolute', bottom: '40px', right: '20px' }}>
        <ConfirmButton
          onClick={handleConfirmClick}
          text=" 확인 "
          style={{ width: '74px', height: '42px' }} // 인라인 스타일 추가
        />
      </div>
    </div>
  );
};

export default WeekGridPage;
