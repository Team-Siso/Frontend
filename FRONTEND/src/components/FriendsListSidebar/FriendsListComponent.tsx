import { useEffect, useState } from "react";
import { useStore } from "@/store";
import FriendComponent from "./FriendComponent";
import DefaultImage from "@/assets/profile.png";
import Toggle from "../Toggle";
const FriendsListComponent = () => {
  const { followings, followers, fetchFollowings, fetchFollowers, memberId } = useStore();
  const [view, setView] = useState("following");
  const handleToggleChange = (isFollowing) => {
    setView(isFollowing ? "following" : "follower");
  };
  useEffect(() => {
    if (memberId) {
      console.log("fetchFollowings 호출");
      fetchFollowings(memberId);
      console.log("fetchFollowers 호출");
      fetchFollowers(memberId);
    }
  }, [memberId, fetchFollowings, fetchFollowers]);
  const listToDisplay = view === "following" ? followings : followers;
  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <Toggle
          id="view-toggle"
          label=""
          onToggle={handleToggleChange}
          marginClassName=""
          checkedBgClass="bg-pink-500"
          uncheckedBgClass="bg-blue-500"
          aText="팔로잉"
          bText="팔로워"
        />
      </div>
      <div>
        {(listToDisplay || []).map((friend, index) => {
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
