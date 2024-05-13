import React from 'react';
import { startOfWeek, eachDayOfInterval, endOfWeek, format } from 'date-fns';

interface WeekDatesProps {
  selectedDate: Date;
}

const WeekDates: React.FC<WeekDatesProps> = ({ selectedDate }) => {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',  // 전체 요소를 오른쪽으로 정렬
      margin: '10px 0',
      marginRight: '3px', 
    }}>
      {weekDays.map((day, index) => (
        <div key={index} style={{
          display: 'inline-block',
          width: '50px',  // 조정 가능
          height: '50px',  // 조정 가능
          lineHeight: '50px',  // 중앙 정렬을 위해
          backgroundColor: index === new Date().getDay() ? '#5b5b5b' : '#ccc',  // 오늘 날짜는 다른 색상
          color: '#fff',
          borderRadius: '20%',  // 원형 디자인
          margin: '0 50px',  // 날짜 간 간격 조정
          textAlign: 'center',  // 텍스트 중앙 정렬
        }}>
          {format(day, 'dd')}
        </div>
      ))}
    </div>
  );
};

export default WeekDates;
