/*

캘린더 라이브러리 react-calendar 를 import 하려 캘린더를 구현함
날짜 라이브러리 date-fns 를 활용하였다.

***import된 항목 설명***
1. Calendar : Calendar 컴포넌트는 react-calendar 라이브러리에서 가져왔다.
2. "react-calendar/dist/Calendar.css" : react-calendar 라이브러리의 기본 스타일 시트(CSS) 
3. moment : moment()를 호출하면 현재 날짜와 시간을 생성
4. isSaturday, isSunday : 현재 날짜가 토요일인지(일요일인지) 확인하는 함수
5. CustomCalendar.css : 내가 직접 수정한 css

*/

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { isSaturday, isSunday } from "date-fns";
import "./CustomCalendar.css";

type Value = Date | [Date, Date];

interface CustomCalendarProps {
  onDateChange: (date: Value) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ onDateChange }) => {
  // value : 현재 선택된 날짜를 저장하며, 기본값은 오늘 날짜(new Date())
  const [value, setValue] = useState<Value>(new Date());

  // handleDateChange : 날짜 선택 시 호출
  // setValue로 value 상태를 업데이트하고, 부모 컴포넌트로 선택된 날짜(selectedDate)를 전달
  const handleDateChange = (selectedDate: Value) => {
    setValue(selectedDate);
    onDateChange(selectedDate);
  };

  // 달력의 각 날짜(tile)에 클래스 이름을 지정하는 함수
  // 월 단위(view === "month")로 달력을 볼 때,
  // 토요일과 일요일에만 각각 saturday와 sunday 클래스를 추가하여 스타일을 적용
  // 토요일은 파란색, 일요일은 빨간색 색상을 적용한다.
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      if (isSaturday(date)) return "saturday";
      if (isSunday(date)) return "sunday";
    }
    return "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <main style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Calendar
          locale="en-US"
          onChange={handleDateChange}
          value={value}
          formatDay={(date) => moment(date).format("DD")} // 날짜를 두 자리 숫자 형식으로 변환하여 표시
          tileClassName={tileClassName}
          showNeighboringMonth={false} // 현재 달 외의 날짜를 표시할지 여부를 결정
          tileContent={({ date }) => <div className="date-tile">{date.getDate()}</div>}
          navigationLabel={({ date }) => (
            <div className="react-calendar__navigation__label">
              <span className="year-label">{moment(date).format("YYYY")}</span>
              {/* MMMM은 월을 영어 형식으로 나타낸다 */}
              <span className="month-label">{moment(date).format("MMMM")}</span>
            </div>
          )}
        />
      </main>
    </div>
  );
};

export default CustomCalendar;
