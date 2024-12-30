/*

캘린더(달력) 컴포넌트 
MainPage 접속시 기본으로 렌더링되도록 설정된 컴포넌트
토글을 통해 주간 타임테이블로 이동 가능
<고정루틴관리하기> 버튼을 통해 고정루틴관리 컴포넌트(격자)로 이동 가능


***사용된 컴포넌트 설명***

1. CustomCalendar : 달력 컴포넌트
2. WeekGridPage : 주간 타임테이블(격자)
3. ConfirmButton : 우측 하단에 렌더링되는 고정루틴관리하기(격자)로 이동하는 버튼
4. Toggle : 토글을 클릭하면 주간 타임테이블(격자, WeekGridPage)을 렌더링한다.

*/

import { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import WeekGridPage from "../Grid/WeekGridPage";
import ConfirmButton from "../ConfirmButton";
import Toggle from "../Toggle";
import { useStore } from "../../store";

const CalendarPage = ({ onPageChange }) => {
  const { memberId, setSelectedDate, fetchSchedulesByDate } = useStore();

  // 화면 모드("calendar" or "weekGrid")
  const [view, setView] = useState("calendar");
  // 현재 선택된 날짜(로컬 state, Date 객체 형태)
  const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());

  // 토글 (달력 <-> 주간 그리드)
  const handleToggleChange = (isWeekGrid) => {
    setView(isWeekGrid ? "weekGrid" : "calendar");
  };

  // 고정 루틴 관리하기 버튼
  const handleConfirmClick = () => {
    if (typeof onPageChange === "function") {
      onPageChange("fixGrid");
    } else {
      console.error("onPageChange is not a function");
    }
  };

  // 달력에서 날짜 클릭 시
  const handleDateChange = (date) => {
    setSelectedDateLocal(date);

    // "YYYY-MM-DD" 형태로 변환
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;

    // store.selectedDate = "YYYY-MM-DD"
    setSelectedDate(dateString);

    // 해당 날짜 스케줄 조회
    if (memberId) {
      fetchSchedulesByDate(memberId, dateString);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Toggle id="view-toggle" label="" onToggle={handleToggleChange} />
      </div>

      {view === "weekGrid" ? (
        <WeekGridPage selectedDate={selectedDateLocal} />
      ) : (
        <CustomCalendar onDateChange={handleDateChange} />
      )}

      {view === "calendar" && (
        <ConfirmButton onClick={handleConfirmClick} text="고정 루틴 관리하기" />
      )}
    </div>
  );
};

export default CalendarPage;
