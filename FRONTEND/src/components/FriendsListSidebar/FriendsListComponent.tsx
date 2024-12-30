import { useEffect } from "react";
import { useStore } from "@/store";
import FriendComponent from "./FriendComponent";
import DefaultImage from "@/assets/profile.png";
import ToggleComponent from "./ToggleComponent";
const FriendsListComponent = () => {
  const { followings, fetchFollowings, memberId } = useStore();

  useEffect(() => {
    if (memberId) {
      fetchFollowings(memberId);
    }
  }, [memberId, fetchFollowings]);

  return (
    <div>
      <ToggleComponent />
      <div>
        {followings.map((friend, index) => (
          <FriendComponent
            key={index}
            name={friend.name}
            isOnline={friend.isActive} // 서버에서 isActive 필드 사용
            profilePicture={friend.profilePicture || DefaultImage}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendsListComponent;
