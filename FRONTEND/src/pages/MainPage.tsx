import React from "react";
import Custom from "../components/Calendar/CustomCalendar";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";
import CalendarPage from "../components/Calendar/CalendarPage";

// 각 컴포넌트마다 차지하는 공간을 알아보려구 우선 핑크색, 노란색, 회색으로 배경을 설정했다..

const MainPage = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="bg-pink-500 flex-none" style={{ width: "5%" }}>
        <FriendsListSidebar />
      </div>
      <div className="bg-yellow-400 flex-none" style={{ width: "25%" }}>
        <ListSidebar />
      </div>
      <div className="bg-gray-300 flex-auto">
        <CalendarPage />
      </div>
    </div>
  );
};

export default MainPage;
