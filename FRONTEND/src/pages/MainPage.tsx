import { useState, useEffect } from "react";
import { useStore } from "../store";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";
import CalendarPage from "../components/Calendar/CalendarPage";
import FixGridPage from "../components/Grid/FixGridPage";
import MenuComponent from "../components/Menu/MenuComponent";

const MainPage = () => {
  const { fetchFollowings, memberId } = useStore();
  const [currentPage, setCurrentPage] = useState("calendar");

  useEffect(() => {
    if (memberId) {
      console.log('Calling fetchFollowings with memberId:', memberId); // 로그 추가
      fetchFollowings(memberId);
    }
  }, [memberId, fetchFollowings]);

  const handlePageChange = (page: string) => {
    console.log("Page changing to:", page);
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
        {currentPage === "calendar" && <CalendarPage onPageChange={handlePageChange} />}
        {currentPage === "fixGrid" && <FixGridPage onPageChange={handlePageChange} />}
      </div>
      <div className="absolute bottom-4 left-4 z-50">
        <MenuComponent />
      </div>
    </div>
  );
};

export default MainPage;
