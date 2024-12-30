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
        {followings.map((friend, index) => {
          console.log("friend", friend);
          return (
            <FriendComponent
              key={index}
              name={friend.name.length > 6 ? friend.name.slice(0, 6) + "..." : friend.name}
              isOnline={friend.isActive} // 서버에서 isActive 필드 사용
              //default 값이 string이기 때문에
              profilePicture={
                friend.profilePicture !== null && friend.profilePicture !== "string"
                  ? friend.profilePicture
                  : DefaultImage
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default FriendsListComponent;
