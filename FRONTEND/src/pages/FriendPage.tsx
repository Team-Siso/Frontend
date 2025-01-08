import React, { useState } from "react";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar_Friend from "../components/ListSidebar_Friend/ListSidebar_Friend";
import CalendarPage_Friend from "../components/Calendar_Friend/CalendarPage_Friend";
import MenuComponent from "../components/Menu/MenuComponent";

interface FriendPageProps {
  openFriendSearchModal: () => void; // 친구 검색 모달 열기 핸들러
  openSettingsModal: () => void; // 설정 모달 열기 핸들러
}

const FriendPage: React.FC<FriendPageProps> = ({ openFriendSearchModal, openSettingsModal }) => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="bg-EDEEEE flex-none" style={{ width: "60px" }}>
        <FriendsListSidebar />
      </div>
      <div
        className="bg-[#EDE0EC] flex-none border border-D6D6D6   rounded"
        style={{ width: "330px" }}
      >
        <ListSidebar_Friend />
      </div>
      <div className="flex-grow">
        <CalendarPage_Friend />
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

export default FriendPage;
