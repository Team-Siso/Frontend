import React, { useEffect } from "react";
import { useStore } from "../../store";
import FriendComponent from "./FriendComponent";

const FriendsListComponent = () => {
  const { followings, fetchFollowings, memberId } = useStore();

  useEffect(() => {
    if (memberId) {
      fetchFollowings(memberId);
    }
  }, [memberId, fetchFollowings]);

  return (
    <div>
      {followings.map((friend, index) => (
        <FriendComponent 
          key={index} 
          name={friend.name} 
          isOnline={friend.isActive} // 서버에서 isActive 필드 사용
          profilePicture={friend.profilePicture || "default-profile-pic-url"} 
        />
      ))}
    </div>
  );
};

export default FriendsListComponent;
