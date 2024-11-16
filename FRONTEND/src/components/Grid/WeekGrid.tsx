import React, { useState } from 'react';
import './WeekGrid.css';

// WeekGrid 컴포넌트에 전달되는 props 정의
interface WeekGridProps {
  showGrid: boolean; // 그리드 라인 표시 여부를 결정하는 prop
}

// 주간 시간표를 그리드 형식으로 보여주는 컴포넌트
const WeekGrid: React.FC<WeekGridProps> = ({ showGrid }) => {
  // 요일과 시간대 정의
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // 요일 배열
  const times = Array.from({ length: 48 }, (_, i) => { // 30분 간격 시간대 배열 생성
    const hour = (Math.floor(i / 2) + 5) % 24; // 5시부터 시작
    const minute = i % 2 === 0 ? '00' : '30'; // 짝수는 '00', 홀수는 '30'을 반환
    return `${hour.toString().padStart(2, '0')}:${minute}`; // '05:00' 형식의 시간 문자열 반환
  });

  // 요일별 색상을 지정한 배열
  const colors = ['#D8EAF6', '#D9F6D8', '#FDEDE5', '#DAEBE5', '#d5dfef', '#fcd8ee', '#ead6fb'];

  // 상태 관리
  const [selectedCells, setSelectedCells] = useState<{ [key: string]: boolean }>({}); // 선택된 셀 상태
  const [dragging, setDragging] = useState(false); // 드래그 중인지 여부
  const [dragStart, setDragStart] = useState<{
    dayIndex: number; // 드래그 시작 시의 요일 인덱스
    timeIndex: number; // 드래그 시작 시의 시간 인덱스
    partIndex: number; // 드래그 시작 시의 세부 시간 파트 인덱스
    newState: boolean; // 드래그 시작 시의 선택 상태
  } | null>(null);

  // 마우스 다운 핸들러: 선택 상태 변경 및 드래그 시작
  const handleMouseDown = (dayIndex: number, timeIndex: number, partIndex: number) => {
    const key = `${dayIndex}-${timeIndex}-${partIndex}`; // 고유한 셀 키 생성
    const newState = !selectedCells[key]; // 기존 상태를 반전
    setDragging(true); // 드래그 시작
    setDragStart({ dayIndex, timeIndex, partIndex, newState }); // 드래그 시작 위치와 상태 저장
    setSelectedCells((prevState) => ({ ...prevState, [key]: newState })); // 선택 상태 업데이트
  };

  // 마우스 엔터 핸들러: 드래그 중 선택 상태 적용
  const handleMouseEnter = (dayIndex: number, timeIndex: number, partIndex: number) => {
    if (dragging && dragStart) { // 드래그 중인 상태일 때만 동작
      const startDayIndex = dragStart.dayIndex;
      if (startDayIndex !== dayIndex) return; // 같은 요일 내에서만 드래그 가능

      const rangeStart = Math.min(dragStart.timeIndex, timeIndex); // 드래그 범위 시작
      const rangeEnd = Math.max(dragStart.timeIndex, timeIndex); // 드래그 범위 끝

      const newSelectedCells = { ...selectedCells }; // 새로운 상태 객체 생성

      // 드래그 범위 내 셀 상태 업데이트
      for (let index = rangeStart; index <= rangeEnd; index++) {
        for (let part = 0; part <= 2; part++) {
          const key = `${dayIndex}-${index}-${part}`;
          if (
            (index === dragStart.timeIndex && part >= dragStart.partIndex) || // 시작 셀 포함
            (index === timeIndex && part <= partIndex) || // 끝 셀 포함
            (index !== dragStart.timeIndex && index !== timeIndex) // 중간 셀 포함
          ) {
            newSelectedCells[key] = dragStart.newState; // 선택 상태 반영
          }
        }
      }

      setSelectedCells(newSelectedCells); // 상태 업데이트
    }
  };

  // 마우스 업 핸들러: 드래그 종료
  const handleMouseUp = () => {
    setDragging(false); // 드래그 상태 종료
    setDragStart(null); // 드래그 시작 정보 초기화
  };

  return (
    <div className="week-grid-container" onMouseUp={handleMouseUp}>
      {/* 시간대와 요일별 셀 렌더링 */}
      <div className={`week-grid ${!showGrid ? 'hidden-grid-lines' : ''}`}>
        {/* 시간 레이블 */}
        <div className="time-labels">
          {times.map((time, index) => (
            <div key={index} className="time-cell">
              {time} {/* 시간대 출력 */}
            </div>
          ))}
        </div>
        {/* 요일 열 */}
        {days.map((day, dayIndex) => (
          <div key={day} className="day-column">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-cell">
                {/* 세부 시간 파트 */}
                {[0, 1, 2].map((partIndex) => {
                  const key = `${dayIndex}-${timeIndex}-${partIndex}`;
                  const isSelected = selectedCells[key]; // 선택 상태 확인
                  const color = colors[dayIndex % colors.length]; // 요일별 색상 지정
                  return (
                    <div
                      key={partIndex} // 세부 파트의 고유 키
                      className={`time-cell-part ${isSelected ? 'selected' : ''}`} // 선택 상태에 따른 클래스
                      onMouseDown={() => handleMouseDown(dayIndex, timeIndex, partIndex)} // 마우스 다운 이벤트 핸들러
                      onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex, partIndex)} // 드래그 중 셀 선택 핸들러
                      style={{ backgroundColor: isSelected ? color : 'transparent' }} // 선택 상태에 따른 배경색
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