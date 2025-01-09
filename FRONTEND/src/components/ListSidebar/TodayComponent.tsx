// 리스트 사이드바에서 맨 위에 오늘 날짜를 렌더링할 컴포넌트 입니다.

import moment from "moment";
import { useStore } from "@/store"; // store 경로에 맞춰 수정

const TodayComponent = ({ className }) => {
  // store에서 선택된 날짜(YYYY-MM-DD 형태) 가져오기
  const selectedDate = useStore((state) => state.selectedDate);

  let displayDayNumber;
  let displayDayName;

  if (selectedDate) {
    // 달력에서 날짜가 선택된 경우
    // selectedDate: "YYYY-MM-DD" 형식이므로 moment로 파싱
    const dateObj = moment(selectedDate, "YYYY-MM-DD");
    displayDayNumber = dateObj.format("D");   // 예: '30'
    displayDayName = dateObj.format("ddd");   // 예: 'Mon', 'Tue' ...
  } else {
    // 아직 날짜 선택이 없으면 오늘 날짜로 표시
    const today = moment();
    displayDayNumber = today.format("D");
    displayDayName = today.format("ddd");
  }

  return (
    <div className={`flex items-baseline pl-3 pt-3 font-sans text-lg ${className}`}>
      <div className="text-4xl text-gray585151 font-bold">{displayDayNumber}</div>
      <div className="ml-1 text-xs text-gray818181">{displayDayName}</div>
    </div>
  );
};

export default TodayComponent;
