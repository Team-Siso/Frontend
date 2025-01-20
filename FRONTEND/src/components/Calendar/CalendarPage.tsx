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

// CalendarPage.jsx
import { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import WeekGridPage from "../Grid/WeekGridPage";
import ConfirmButton from "../ConfirmButton";
import Toggle from "../Toggle";
import { useStore } from "../../store";
import { format } from "date-fns";

const CalendarPage = ({ onPageChange }) => {
  const { memberId, setSelectedDate, fetchSchedulesByDate, setOpenAddTodo } = useStore();

  // 기본 뷰: 달력
  const [view, setView] = useState("calendar");
  const [isChecked, setIsChecked] = useState(false);

  // 현재 선택된 날짜(프론트 단에서 관리)
  const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());

  // 토글 클릭에 따라 'weekGrid', 'calendar'로 상태를 변경한다.
  const handleToggleChange = (checked) => {
    console.log("handleToggleChange called with:", checked);
    setIsChecked(checked);
    setView(checked ? "weekGrid" : "calendar");
  };

  // 고정 루틴 관리 버튼
  const handleConfirmClick = () => {
    console.log("고정루틴 관리하기 버튼 클릭!");
    if (typeof onPageChange === "function") {
      onPageChange("fixGrid");
    } else {
      console.error("onPageChange is not a function");
    }
  };

  // 달력에서 날짜 클릭 시
  const handleDateChange = (date) => {
    setSelectedDateLocal(date);

    // "YYYY-MM-DD"
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;

    // store에 날짜 저장
    setSelectedDate(dateString);

    // 해당 날짜의 일정만 불러오기
    if (memberId) {
      fetchSchedulesByDate(memberId, dateString);
    }

    // 투두 입력창 열기 트리거
    //setOpenAddTodo(true);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Toggle
          id="view-toggle2"
          label=""
          isChecked={isChecked}
          onToggle={handleToggleChange}
          marginClassName="ml-20"
          aText=""
          bText=""
        />
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
