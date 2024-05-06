// 이 컴포넌트는 친구 컴포넌트(FriendComponent)를 친구의 수 만큼 렌더링 해주는 코드의 컴포넌트이다.

// import React from "react";
import FriendComponent from "./FriendComponent";

// 가정을 위해 친구들의 목록을 임시 데이터로 만들었습니다.
const friendsData = [
  { name: "초이니", isOnline: true },
  { name: "새싹이", isOnline: false },
  { name: "감자", isOnline: true },
  { name: "땅콩이", isOnline: false },
  { name: "김좌", isOnline: true },
  // ... 나머지 친구들
];

interface FriendsListProps {
  numFriends: number;
}

const FriendsList = () => {
  // 진행 중인 친구들을 먼저 나열합니다.
  const sortedFriends = friendsData.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));

  return (
    <div>
      {sortedFriends.map((friend, index) => (
        <FriendComponent key={index} name={friend.name} isOnline={friend.isOnline} />
      ))}
    </div>
  );
};

export default FriendsList;
