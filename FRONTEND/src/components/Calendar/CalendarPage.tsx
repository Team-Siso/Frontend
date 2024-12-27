import { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import WeekGridPage from "../Grid/WeekGridPage";
import ConfirmButton from "../ConfirmButton";
import Toggle from "../Toggle";

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

interface CalendarPageProps {
  onPageChange?: (page: string) => void;
}

// Value 타입 확인: CustomCalendar의 Value 타입
type Value = Date | [Date, Date] | null;

const CalendarPage: React.FC<CalendarPageProps> = ({ onPageChange }) => {
  // view : 현재 표시되는 뷰 상태('calendar' 또는 'weekGrid')를 관리(기본 설정은 달력)
  const [view, setView] = useState("calendar");

  // Toggle의 checked 상태를 관리
  const [isWeekGrid, setIsWeekGrid] = useState(false);

  // selectedDate : 현재 선택된 날짜를 저장(초기값은 오늘 날짜)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 토글 클릭에 따라 'weekGrid', 'calendar'로 상태를 변경한다.
  const handleToggleChange = (checked: boolean) => {
    setIsWeekGrid(checked); // Toggle의 상태 업데이트
    setView(checked ? "weekGrid" : "calendar"); // view 상태 업데이트
  };

  // '고정 루틴 관리하기' 버튼 클릭 핸들러
  const handleConfirmClick = () => {
    console.log("고정루틴 관리하기 버튼 클릭!");
    if (typeof onPageChange === "function") {
      onPageChange("fixGrid");
    } else {
      console.error("onPageChange is not a function");
    }
  };

  // 선택된 날짜가 변경되면 'selectedDate' 상태를 업데이트
  const handleDateChange = (date: Value) => {
    if (date instanceof Date) {
      setSelectedDate(date); // 단일 날짜 선택 시
    } else if (Array.isArray(date) && date[0] instanceof Date) {
      setSelectedDate(date[0]); // 범위 선택 시 시작 날짜만 사용
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* 상단 토글 */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Toggle id="view-toggle" label="" checked={isWeekGrid} onToggle={handleToggleChange} />
      </div>

      {/* 주간 타임테이블 또는 달력 표시 */}
      {view === "weekGrid" ? (
        <WeekGridPage selectedDate={selectedDate} />
      ) : (
        <CustomCalendar onDateChange={handleDateChange} />
      )}

      {/* 고정 루틴 관리 버튼 */}
      {view === "calendar" && (
        <ConfirmButton onClick={handleConfirmClick} text="고정 루틴 관리하기" />
      )}
    </div>
  );
};

export default CalendarPage;
