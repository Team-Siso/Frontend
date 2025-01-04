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

const CalendarPage = ({ onPageChange }) => {
  // view : 현재 표시되는 뷰 상태('calendar' 또는 'weekGrid')를 관리(기본 설정은 달력이다)
  const [view, setView] = useState("calendar");
  const [isChecked, setIsChecked] = useState(false);
  // selectedDate : 현재 선택된 날짜를 저장(초기값은 오늘 날짜)
  // new Date()는 JavaScript Date 객체로, 호출하는 순간의 시스템 시간을 기준으로 현재 날짜와 시간을 반환
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 토글 클릭에 따라 'weekGrid', 'calendar'로 상태를 변경한다.
  const handleToggleChange = (checked) => {
    console.log("handleToggleChange called with:", checked);
    setIsChecked(checked);
    setView(checked ? "weekGrid" : "calendar");
  };

  // '고정 루틴 관리하기' 버튼 클릭 핸들러
  // 1. 'onPageChange' 함수가 전달되었는지 확인하고, 전달된 경우 'fixGrid' 페이지로 이동합니다.
  // 2. 만약 'onPageChange'가 함수가 아니라면, 콘솔에 오류 메시지를 출력합니다.

  // 'onPageChange' 가 함수인지 확인하는 이유?
  // 1. 유연성 확보: CalendarPage 컴포넌트를 재사용하는 상황에서 onPageChange를 전달하지 않아도 에러가 나지 않게 하려는 목적
  // 2. 안정성 강화: onPageChange가 함수인지 확인함으로써, 잘못된 타입이 들어오면 실행되지 않게 하여 예기치 않은 에러를 방지
  const handleConfirmClick = () => {
    console.log("고정루틴 관리하기 버튼 클릭!");
    if (typeof onPageChange === "function") {
      onPageChange("fixGrid");
    } else {
      console.error("onPageChange is not a function");
    }
  };

  // 선택된 날짜가 변경되면 'selectedDate' 상태를 업데이트
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Toggle
          id="view-toggle2"
          label=""
          isChecked={isChecked}
          onToggle={(checked) => {
            console.log("checked:", checked);
            handleToggleChange(checked);
          }}
          marginClassName="ml-20"
          aText=""
          bText=""
        />
      </div>
      {view === "weekGrid" ? (
        <WeekGridPage selectedDate={selectedDate} />
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
