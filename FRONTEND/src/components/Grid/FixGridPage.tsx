import { useState } from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

// 주간 그리드와 확인 버튼을 렌더링하며 페이지 전환 기능 제공
const FixGridPage = ({ onPageChange }) => {
    // WeekGrid를 표시할지 여부를 제어하는 상태 (true면 표시, false면 숨김)
    const [showGrid, setShowGrid] = useState(true);

    // 주간 그리드 상단에 표시할 요일 이름 배열
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 확인 버튼 클릭 시 실행: 그리드를 숨기고 페이지를 'calendar'로 변경
    const handleConfirmClick = () => {
        setShowGrid(false); // WeekGrid 숨기기
        onPageChange('calendar'); // 페이지를 'calendar'로 전환
    };

    return (
        <div>
            {/* 요일 이름을 Flexbox로 정렬하여 렌더링 */}
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px', width: '100%', marginLeft: '10px' }}>
                {daysOfWeek.map(day => (
                    <div 
                        key={day} // 요일 고유 키
                        className={`day day-${day}`} // CSS 클래스 적용 (공통 클래스와 요일별 클래스)
                        style={{ marginLeft: '40px', fontSize: '18px' }}
                    >
                        {day} {/* 요일 이름 표시 */}
                    </div>
                ))}
            </div>
            <WeekGrid showGrid={showGrid} />
            <ConfirmButton text="확인" onClick={handleConfirmClick} />
        </div>
    );
};

export default FixGridPage;
