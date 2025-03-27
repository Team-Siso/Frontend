import React, { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import { useStore } from "../../store";

type Value = Date | [Date, Date];

interface CalendarPageFriendProps {
  friendId: number; // friendId를 props로 받음
}

const CalendarPage_Friend: React.FC<CalendarPageFriendProps> = ({ friendId }) => {
  const { setSelectedDate, fetchSchedulesByDate } = useStore();
  const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());

  // Value 타입(Date 또는 [Date, Date])을 단일 Date로 변환하는 핸들러
  const handleDateChange = (date: Value) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSelectedDateLocal(selected);

    // "YYYY-MM-DD" 형식으로 변환
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;

    // store에 날짜 저장
    setSelectedDate(dateString);

    // friendId가 있으면 해당 날짜의 일정 조회
    if (friendId) {
      fetchSchedulesByDate(friendId, dateString);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}></div>
      <CustomCalendar onDateChange={handleDateChange} />
    </div>
  );
};

export default CalendarPage_Friend;
