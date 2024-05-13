import React, { useState } from "react";
import Custom from "../components/Calendar/CustomCalendar";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";
import CalendarPage from "../components/Calendar/CalendarPage";
import FixGridPage from '../components/Grid/FixGridPage'; 

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState('calendar');

  const handlePageChange = (page) => {
    console.log('Page changing to:', page); // 페이지 변경 로그
    setCurrentPage(page);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="bg-EDEEEE flex-none" style={{ width: "60px" }}>
        <FriendsListSidebar />
      </div>
      <div className="flex-none border border-EDEEEE rounded" style={{ width: "330px" }}>
        <ListSidebar />
      </div>
      <div className="flex-grow">
        {currentPage === 'calendar' && <CalendarPage onPageChange={handlePageChange} />}
        {currentPage === 'fixGrid' && <FixGridPage onPageChange={handlePageChange} />}
      </div>
    </div>
  );
};

export default MainPage;
