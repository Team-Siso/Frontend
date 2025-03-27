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

import React, { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import WeekGridPage from "../Grid/WeekGridPage";
import ConfirmButton from "../ConfirmButton";
import Toggle from "../Toggle";
import { useStore } from "../../store";
import { format } from "date-fns";

type Value = Date | [Date, Date];

const CalendarPage: React.FC<{ onPageChange: (page: string) => void }> = ({ onPageChange }) => {
  // Zustand 스토어에서 memberId와 setSelectedDate를 가져옴
  const { memberId, setSelectedDate } = useStore();
  const [view, setView] = useState("calendar");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());

  // 토글 버튼: 달력 / 주간 그리드 전환
  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
    setView(checked ? "weekGrid" : "calendar");
  };

  // 고정 루틴 관리 버튼
  const handleConfirmClick = () => {
    if (typeof onPageChange === "function") {
      onPageChange("fixGrid");
    } else {
      console.error("onPageChange is not a function");
    }
  };

  // 달력에서 날짜 클릭 시 처리: Value 타입(Date 또는 [Date, Date])을 받아 단일 Date로 변환
  const handleDateChange = (date: Value) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSelectedDateLocal(selected);

    // "YYYY-MM-DD" 형식으로 변환
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(dateString);
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
        <WeekGridPage selectedDate={selectedDateLocal} onPageChange={onPageChange} />
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
