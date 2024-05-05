// 리스트 사이드바에서 맨 위에 오늘 날짜를 렌더링할 컴포넌트 입니다.

import React from "react";
import moment from "moment";

const TodayComponent = ({ className }) => {
  const today = moment(); // 오늘 날짜 객체 생성
  const dayNumber = today.format("D"); // 날짜 (숫자만)
  const dayName = today.format("ddd"); // 요일 (월, 화, 수...)

  return (
    <div className={`flex items-baseline pl-3 pt-3 font-sans bg-pink-200 text-lg ${className}`}>
      <div className="text-4xl text-585151 font-bold">{dayNumber}</div>
      <div className="ml-1 text-xs text-818181">{dayName}</div>
    </div>
  );
};

export default TodayComponent;
