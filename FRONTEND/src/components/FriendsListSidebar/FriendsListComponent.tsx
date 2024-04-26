// 이 컴포넌트는 친구 컴포넌트(FriendComponent)를 친구의 수 만큼 렌더링 해주는 코드의 컴포넌트이다.

import React from "react";
import FriendComponent from "./FriendComponent";

interface FriendsListProps {
  numFriends: number;
}

const FriendsList: React.FC<FriendsListProps> = ({ numFriends }) => {
  // 숫자만큼 FriendComponent를 생성하기 위한 배열을 만듭니다.
  const friends = Array.from({ length: numFriends }, (_, index) => (
    <FriendComponent key={index} name="홍길동" profilePic="profile.jpg" status="온라인" />
  ));

  return <div>{friends}</div>;
};

export default FriendsList;
