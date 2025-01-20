/*

주간 타임테이블에 렌더링 되는 WeekDates 컴포넌트
날짜 라이브러리 date-fns 를 활용하였다.

*** date-fns 라이브러리에서 가져온 메서드들 ***
(주가 일요일 시작으로, 해당 날짜의 첫 주의 시작과 마지막 주의 끝을 계산한다.)
1. startOfWeek
    startOfWeek( 첫째 주의 첫 날, { weekStartsOn: 0 }) : 주어진 날짜의 해당 주의 첫째 날을 반환
    여기서 '0'은 일요일을 의미, 일요일부터 시작하는 달력이라는 뜻
2. endOfWeek
    endOfWeek( 마지막째 주의 마지막 날, { weekStartsOn: 0 }) : 주어진 날짜의 해당 주의 마지막 날을 반환
(달력에 날짜를 표시하기위해 계산한 기간 동안의 모든 날짜를 배열로 가져온다.)
3. eachDayOfInterval 
    eachDayOfInterval({ start: startOfFirstWeek, end: endOfLastWeek }); : 주어진 start 날짜부터 end 까지의 모든 날짜를 배열로 반환
(모든 날짜 배열에서 원하는 값을 추출한다.)
4. format  
    format(날짜, ‘yyyy-MM-dd’) : Date 객체 값을 2024-04-07 형태의 문자열로 변환
5. isSameDay
    두 날짜가 같은 날인지를 비교하는 데 사용
    isSameDay(date1, date2) 에서 date1과 date2가 같으면 true를 반환

*/

import React from "react";
import {
  startOfWeek,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";

// 사용자 주어진 아이콘 경로 (절대/상대 경로 맞춰 import):
import MonthVectorLeft from "@/assets/MonthVectorLeft.svg";
import MonthVectorRight from "@/assets/MonthVectorRight.svg";

interface WeekDatesProps {
  selectedDate: Date;
  onSelectedDateChange?: (date: Date) => void;
}

const WeekDates: React.FC<WeekDatesProps> = ({ selectedDate, onSelectedDateChange }) => {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  // 이전 주 / 다음 주 화살표
  const handlePrevWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    if (onSelectedDateChange) {
      onSelectedDateChange(newDate);
    }
  };
  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    if (onSelectedDateChange) {
      onSelectedDateChange(newDate);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: "10px 0",
        marginRight: "3px",
      }}
    >
      {/* 왼쪽 아이콘 (MonthVectorLeft) */}
      <img
        src={MonthVectorLeft}
        alt="Previous Week"
        style={{ width: "24px", height: "24px", cursor: "pointer", marginRight: "20px" }}
        onClick={handlePrevWeek}
      />

      {/* 요일 날짜 */}
      {weekDays.map((day, index) => (
        <div
          key={index}
          style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            lineHeight: "50px",
            backgroundColor: isSameDay(day, today) ? "#5b5b5b" : "#ccc",
            color: "#fff",
            borderRadius: "20%",
            margin: "0 50px",
            textAlign: "center",
            // 날짜 클릭 시 투두 갱신로직 제거 => 그냥 버튼X
            cursor: "default",
          }}
        >
          {/* '일'만 표시 */}
          {format(day, "d")}
        </div>
      ))}

      {/* 오른쪽 아이콘 (MonthVectorRight) */}
      <img
        src={MonthVectorRight}
        alt="Next Week"
        style={{ width: "24px", height: "24px", cursor: "pointer", marginLeft: "20px" }}
        onClick={handleNextWeek}
      />
    </div>
  );
};

export default WeekDates;
