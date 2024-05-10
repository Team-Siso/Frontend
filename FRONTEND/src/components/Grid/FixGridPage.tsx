import React from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

// FixGridPage에 onPageChange prop을 추가합니다.
const FixGridPage = ({ onPageChange }) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px', width: '100%' }}>
                {daysOfWeek.map(day => (
                    <div key={day} className={`day day-${day}`} style={{ marginLeft: '70px' }}>
                        {day}
                    </div>
                ))}
            </div>
            <WeekGrid />
            <ConfirmButton text="Confirm" onClick={() => onPageChange('calendar')} />
        </div>
    );
};

export default FixGridPage;
