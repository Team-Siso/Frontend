// 친구 목록 사이드바에 있는 오늘 날짜를 나타내는 컴포넌트 입니다.
import React from "react";

const TodayDateComponent = () => (
  <div className="date-component">
    <p>{new Date().toLocaleDateString()}</p>
  </div>
);

export default TodayDateComponent;
