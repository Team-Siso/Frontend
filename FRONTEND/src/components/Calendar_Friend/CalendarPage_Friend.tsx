import { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import { useStore } from "../../store";

interface CalendarPageFriendProps {
  friendId: number; // friendId를 props로 받음
}
const CalendarPage_Friend: React.FC<CalendarPageFriendProps> = ({ friendId }) => {
  const { setSelectedDate, fetchSchedulesByDate } = useStore();

  const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());

  // 달력에서 날짜 클릭
  const handleDateChange = (date) => {
    setSelectedDateLocal(date);

    // "YYYY-MM-DD"
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;

    // store.selectedDate = "YYYY-MM-DD"
    setSelectedDate(dateString);

    // 해당 날짜 스케줄 조회(원하는 로직이면 유지)
    if (friendId) {
      fetchSchedulesByDate(friendId, dateString);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}></div>
      <CustomCalendar onDateChange={handleDateChange} />=
    </div>
  );
};

export default CalendarPage_Friend;
