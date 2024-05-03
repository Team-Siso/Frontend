// 리스트 사이드바에서 맨 위에 오늘 날짜를 렌더링할 컴포넌트 입니다.

import React from "react";
import moment from "moment";

const TodayComponent = () => {
  const today = moment(); // 오늘 날짜 객체 생성
  const dayNumber = today.format("D"); // 날짜 (숫자만)
  const dayName = today.format("ddd"); // 요일 (월, 화, 수...)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center", // 세로 방향 중앙 정렬
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
      }}
    >
      <div style={{ fontSize: "48px", fontWeight: "bold" }}>{dayNumber}</div>
      <div style={{ marginLeft: "10px" }}>{dayName}</div>
    </div>
  );
};

export default TodayComponent;
