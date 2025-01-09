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
} from "date-fns";
import { useStore } from "../../store";

interface WeekDatesProps {
  selectedDate: Date;
}

const WeekDates: React.FC<WeekDatesProps> = ({ selectedDate }) => {
  const { setSelectedDate } = useStore();

  const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  const handleDayClick = (day: Date) => {
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end", // 전체 요소를 오른쪽으로 정렬
        margin: "10px 0",
        marginRight: "3px",
      }}
    >
      {weekDays.map((day, index) => (
        <div
          key={index}
          onClick={() => handleDayClick(day)} // 날짜 클릭 이벤트
          style={{
            display: "inline-block",
            width: "50px", // 조정 가능
            height: "50px", // 조정 가능
            lineHeight: "50px", // 중앙 정렬을 위해
            backgroundColor: isSameDay(day, today) ? "#5b5b5b" : "#ccc", // 오늘 날짜는 다른 색상
            color: "#fff",
            borderRadius: "20%", // 원형 디자인
            margin: "0 50px", // 날짜 간 간격 조정
            textAlign: "center", // 텍스트 중앙 정렬
            cursor: "pointer", // 클릭 가능하도록 커서 변경
          }}
        >
          {/* day의 일(day)만 추출하여 표시 */}
          {format(day, "d")}
        </div>
      ))}
    </div>
  );
};

export default WeekDates;
