// 리스트 사이드바에서 My goal 목록들을 렌더링할 컴포넌트 입니다.

// Mygoal 제목
// + 버튼
// Mygoal 목록들
import React, { useState } from "react";

// MyGoalComponent 구현
const MyGoalComponent = ({ className }) => {
  // 목표 추가 기능 (더미 기능)
  const addGoal = () => {
    const newGoal = {
      id: goals.length + 1,
      title: `New Goal ${goals.length + 1}`,
      progress: 0,
      isImportant: false,
    };
    setGoals([...goals, newGoal]);
  };

  return (
    <div className={className}>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>My Goal</div>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={addGoal}>
        <img src="/path/to/plus-icon.svg" alt="Add Goal" />
      </div>
    </div>
  );
};

export default MyGoalComponent;
