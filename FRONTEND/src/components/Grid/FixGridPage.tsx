import React, { useState } from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

const FixGridPage = ({ onPageChange }) => {
    const [showGrid, setShowGrid] = useState(true);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleConfirmClick = () => {
        setShowGrid(false);
        onPageChange('calendar');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px', width: '100%', marginLeft: '10px' }}>
                {daysOfWeek.map(day => (
                    <div key={day} className={`day day-${day}`} style={{ marginLeft: '40px', fontSize: '18px' }}>
                        {day}
                    </div>
                ))}
            </div>
            <WeekGrid showGrid={showGrid} />
            <ConfirmButton text="확인" onClick={handleConfirmClick} />
        </div>
    );
};

export default FixGridPage;
