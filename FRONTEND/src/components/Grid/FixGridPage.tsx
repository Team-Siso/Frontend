import React from 'react';
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

const FixGridPage = ({ onPageChange }) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0px', width: '100%',marginLeft:'10px' }}>
                {daysOfWeek.map(day => (
                    <div key={day} className={`day day-${day}`} style={{ marginLeft: '40px', fontSize: '18px' }}>
                        {day}
                    </div>
                ))}
            </div>
            <WeekGrid />
            <ConfirmButton text="확인" onClick={() => onPageChange('calendar')} />
        </div>
    );
};

export default FixGridPage;
