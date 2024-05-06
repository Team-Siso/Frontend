// ListSidebar 컴포넌트는 위에서부터
// 날짜, todolist, my goal list, myprofile 을 렌더링하는 부모 컴포넌트입니다.
// import React from "react";
import TodayComponent from "./TodayComponent";
import TodoListComponent from "./TodoListComponent";
import MyGoalComponent from "./MyGoalComponent";
import MyProfileComponent from "./MyProfileComponent";

const ListSidebar = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none h-60" />{" "}
    <div className="flex-grow flex flex-col">
      <TodoListComponent />
      <MyGoalComponent />
    </div>
    <MyProfileComponent className="flex-none h-120" />
  </div>
);

export default ListSidebar;
