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

/** 
 * "parseToKstDate" 
 * ISO 문자열(UTC) → KST(Date) 
 *   - 예: "2024-12-30T15:00:00Z" ⇒ 한국 시각으로 변환
 */
function parseToKstDate(isoString: string | Date) {
  let d = typeof isoString === "string" ? new Date(isoString) : isoString;
  // d는 UTC 기준 시각
  // d.getTime() + d.getTimezoneOffset() * 60000 → UTC기준 timestamp(ms)
  const utc = d.getTime() + d.getTimezoneOffset() * 60_000;
  // 한국은 UTC+9
  const kst = utc + 9 * 60 * 60_000;
  return new Date(kst); // KST 시각
}

/**
 * "getStartOfWeekKST" 
 *   - KST 시각 기준으로 "일요일 00:00" (week start)을 구함
 */
function getStartOfWeekKST(kstDate: Date) {
  // 일요일=0, 월요일=1 ... 
  // kstDate.getDay() = 요일(0~6)
  const dayOfWeek = kstDate.getDay(); 
  // 일요일부터 시작 → dayOfWeek=0이면 그날이 주 시작
  const start = new Date(kstDate);
  // 시간을 0시로 맞춤
  start.setHours(0, 0, 0, 0);
  // 현재 요일만큼 "날짜를 되돌림"
  start.setDate(start.getDate() - dayOfWeek);
  return start;
}

interface WeekDatesProps {
  selectedDate: Date;
}

/**
 * WeekDates:
 *   - 일요일(0) ~ 토요일(6)까지 7일 표시
 *   - "오늘 날짜"만 색 다르게
 */
const WeekDates: React.FC<WeekDatesProps> = ({ selectedDate }) => {
  // 1) 먼저 selectedDate(보통 로컬 Date)를 "KST"로 환산
  const kstSelected = parseToKstDate(selectedDate);

  // 2) 일요일 0시를 구함
  const startOfWeek = getStartOfWeekKST(kstSelected);

  // 3) [일~토] 날짜 배열 만들기
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const todayKst = parseToKstDate(new Date()); // "지금 시각"의 KST

  /** 
   * 날짜를 "일(day)"만 꺼내서 표시 
   *   - 예: 1일, 2일 ...
   */
  const getDayNumber = (d: Date) => {
    return d.getDate();
  };

  /** 오늘인지 판별 (연/월/일이 같은지)
   */
  const isToday = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "10px 0",
        marginRight: "3px",
      }}
    >
      {weekDays.map((day, index) => {
        const isTodayFlag = isToday(day, todayKst);
        return (
          <div
            key={index}
            style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              lineHeight: "50px",
              backgroundColor: isTodayFlag ? "#5b5b5b" : "#ccc",
              color: "#fff",
              borderRadius: "20%",
              margin: "0 50px",
              textAlign: "center",
            }}
          >
            {getDayNumber(day)}
          </div>
        );
      })}
    </div>
  );
};

export default WeekDates;
