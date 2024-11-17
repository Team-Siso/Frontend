import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";
import CalendarPage from "../components/Calendar/CalendarPage";
import MenuComponent from "../components/Menu/MenuComponent";
import FixGridPage from "../components/Grid/FixGridPage";

interface MainPageProps {
  openFriendSearchModal: () => void; // 친구 검색 모달 열기 핸들러
  openSettingsModal: () => void; // 설정 모달 열기 핸들러
}

const MainPage: React.FC<MainPageProps> = ({ openFriendSearchModal, openSettingsModal }) => {
  const { fetchFollowings, memberId } = useStore();
  const [currentPage, setCurrentPage] = useState("calendar");

  useEffect(() => {
    if (memberId) {
      console.log("Calling fetchFollowings with memberId:", memberId); // 로그 추가
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
        <MenuComponent
          openFriendSearchModal={openFriendSearchModal} // 친구 검색 모달 핸들러 전달
          openSettingsModal={openSettingsModal} // 설정 모달 핸들러 전달
        />
      </div>
    </div>
  );
};

export default MainPage;
