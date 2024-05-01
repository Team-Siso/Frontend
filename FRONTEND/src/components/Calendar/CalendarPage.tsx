// CustomCalendar 컴포넌트를 렌더링하는 페이지
import React from "react";
import CustomCalendar from "./CustomCalendar"; // MainPage 컴포넌트를 불러옴
import "./CalendarPage.css";

const CalendarPage = () => {
  return (
    <div className="calendar-container">
      <CustomCalendar className="custom-calendar" />
    </div>
  ); // MainPage 컴포넌트를 렌더링
};

export default CalendarPage;
