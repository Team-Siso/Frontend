import React, { useState } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "/Users/devwoon/Frontend/FRONTEND/src/components/Calendar/CustomCalendar.css";
import { isSaturday, isSunday } from "date-fns";
import Toggle from "../Toggle";
import WeekGrid from './WeekGrid';
import './WeekGrid.css';
import ConfirmButton from '../ConfirmButton';

const WeekGridPage = () => {
    const [view, setView] = useState("calendar"); // "calendar" 또는 "weekGrid" 뷰 상태 관리

    // Calendar 관련 코드
    const formatMonthYear = (locale, date) => {
        return date.toLocaleString("en-US", { month: "long" });
    };
    const [value, onChange] = useState(new Date());
    const [nowDate, setNowDate] = useState("날짜");

    const handleDateChange = (selectedDate) => {
        onChange(selectedDate);
        setNowDate(moment(selectedDate).format("YYYY년 MM월 DD일"));
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            if (isSaturday(date)) return "saturday";
            if (isSunday(date)) return "sunday";
        }
    };

    const handleToggleChange = (value) => {
        if (value) {
            setView("weekGrid");
        } else {
            setView("calendar");
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "10rem", marginTop: "10px" }}>
                <Toggle
                    id="view-toggle"
                    label=""
                    onToggle={handleToggleChange}
                />
            </div>
            {view === "calendar" ? (
                <main>
                    <Calendar
                        locale="en-US"
                        onChange={handleDateChange}
                        value={value}
                        formatDay={(locale, date) => moment(date).format("DD")}
                        formatMonthYear={formatMonthYear}
                        tileClassName={tileClassName}
                        showNeighboringMonth={false}
                        tileContent={({ date, view }) => <div className="date-tile">{date.getDate()}</div>}
                    />
                </main>
            ) : (
                <WeekGrid />
            )}
        </div>
    );
};

export default WeekGridPage;