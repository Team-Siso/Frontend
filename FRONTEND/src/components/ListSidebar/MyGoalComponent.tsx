// 리스트 사이드바에서 My goal 목록들을 렌더링할 컴포넌트 입니다.

// Mygoal 제목
// + 버튼
// Mygoal 목록들
import React, { useState } from "react";
import PlusButton from "../../assets/PlusButton.svg";

// MyGoalComponent 구현
const MyGoalComponent = ({ className }) => {
  return (
    <div className={`${className} pl-4 pr-4`}>
      <div className="border-t  border-gray-300">
        <div className="flex justify-between items-center p-2.5">
          {" "}
          <div className="text-lg text-gray585151 font-bold pl-1">My Goal</div>{" "}
          <div className="flex items-center pr-2">
            <img src={PlusButton} alt="Add My Goal" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGoalComponent;
