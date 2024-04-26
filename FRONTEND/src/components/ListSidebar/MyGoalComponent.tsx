// 리스트 사이드바에서 My goal 목록들을 렌더링할 컴포넌트 입니다.

// Mygoal 제목
// + 버튼
// Mygoal 목록들
import React from "react";

const MyGoalComponent = () => (
  <div className="my-goal-component">
    <h4>내 목표</h4>
    <ul>
      <li>프로젝트 완성하기</li>
      <li>새로운 기술 습득</li>
    </ul>
  </div>
);

export default MyGoalComponent;
