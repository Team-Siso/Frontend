import React from "react";
import { useStore } from "../../store";
import FriendComponent from "./FriendComponent";

const FriendsListComponent = () => {
  const { followings } = useStore();

  return (
    <div>
      {followings.map((friend, index) => (
        <FriendComponent 
          key={index} 
          name={friend.name} 
          isOnline={true} 
          profilePicture={friend.profilePicture || "default-profile-pic-url"} // 기본 프로필 이미지 URL을 사용하거나 실제 데이터를 사용
        />
      ))}
    </div>
  );
};

export default FriendsListComponent;
