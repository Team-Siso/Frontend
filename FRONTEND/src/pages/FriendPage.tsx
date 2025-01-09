import React, { useState } from "react";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar_Friend from "../components/ListSidebar_Friend/ListSidebar_Friend";
import CalendarPage_Friend from "../components/Calendar_Friend/CalendarPage_Friend";
import MenuComponent from "../components/Menu/MenuComponent";
import { useParams } from "react-router-dom";

interface FriendPageProps {
  openFriendSearchModal: () => void; // 친구 검색 모달 열기 핸들러
  openSettingsModal: () => void; // 설정 모달 열기 핸들러
}

const FriendPage: React.FC<FriendPageProps> = ({ openFriendSearchModal, openSettingsModal }) => {
  const { friendId } = useParams<{ friendId: string }>(); // URL에서 friendId 읽기
  // friendId를 숫자로 변환
  const friendIdAsNumber = Number(friendId);

  if (isNaN(friendIdAsNumber)) {
    return <div>Invalid friend ID</div>; // friendId가 숫자가 아닌 경우 처리
  }
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="bg-EDEEEE flex-none" style={{ width: "60px" }}>
        <FriendsListSidebar />
      </div>
      <div
        className="bg-[#EDE0EC] flex-none border border-D6D6D6   rounded"
        style={{ width: "330px" }}
      >
        <ListSidebar_Friend friendId={friendIdAsNumber} />
      </div>
      <div className=" flex-grow">
        <CalendarPage_Friend friendId={friendIdAsNumber} />
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
