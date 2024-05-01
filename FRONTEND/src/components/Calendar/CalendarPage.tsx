// CustomCalendar 컴포넌트를 렌더링하는 페이지
import React from "react";
import CustomCalendar from "./CustomCalendar"; // MainPage 컴포넌트를 불러옴

const CalendarPage = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <CustomCalendar />
    </div>
  );
};

export default CalendarPage;
