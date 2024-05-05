// ListSidebar 컴포넌트는 위에서부터
// 날짜, todolist, my goal list, myprofile 을 렌더링하는 부모 컴포넌트입니다.
import React from "react";
import TodayComponent from "./TodayComponent";
import TodoListComponent from "./TodoListComponent";
import MyGoalComponent from "./MyGoalComponent";
import MyProfileComponent from "./MyProfileComponent";

const ListSidebar = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none" />{" "}
    {/* 고정된 높이가 필요하다면 className에 h-[값] 추가 */}
    <div className="flex-grow flex flex-col justify-between">
      <TodoListComponent />
      <MyGoalComponent />
    </div>
    <MyProfileComponent className="flex-none" />{" "}
    {/* 고정된 높이가 필요하다면 className에 h-[값] 추가 */}
  </div>
);

export default ListSidebar;
