// 친구 목록 사이드바에 있는 오늘 날짜를 나타내는 컴포넌트 입니다.
import React from "react";
import RestTasksBg from "../../assets/RestTasksBg.svg";

interface RestTasksComponentProps {
  tasksCount: number; // 할 일의 수를 받기 위한 prop
}

const RestTasksComponent: React.FC<RestTasksComponentProps> = ({ tasksCount }) => {
  return (
    <div
      className="relative bg-no-repeat bg-center bg-contain mb-4"
      style={{ backgroundImage: `url(${RestTasksBg})` }}
    >
      <div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{tasksCount}</div>
        </div>
      </div>
    </div>
  );
};

export default RestTasksComponent;
