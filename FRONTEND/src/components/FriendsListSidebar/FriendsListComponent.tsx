import { useEffect, useState } from "react";
import { useStore } from "@/store"; 
import FriendComponent from "./FriendComponent";
import Toggle from "../Toggle";
import DefaultImage from "@/assets/profile.png"; 
import { useNavigate } from "react-router-dom";

const FriendsListComponent = () => {
  // store로부터 데이터와 fetch 함수 가져오기
  const { followings, followers, fetchFollowings, fetchFollowers, memberId } = useStore();

  // "팔로잉/팔로워" 토글 상태
  const [view, setView] = useState<"following" | "follower">("following");
  const [isChecked, setIsChecked] = useState(true);

  const navigate = useNavigate();

  // 마운트 시(or memberId 변경 시) 팔로잉/팔로워 목록 fetch
  useEffect(() => {
    if (memberId) {
      fetchFollowings(memberId);
      fetchFollowers(memberId);
    }
  }, [memberId, fetchFollowings, fetchFollowers]);

  //  토글 이벤트
  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
    setView(checked ? "following" : "follower");
  };

  // 친구 클릭 시 특정 페이지로 이동
  const handleFriendClick = (friendId: number) => {
    navigate("/friend", { state: { friendId } });
  };

  // 토글 상태에 따라 보여줄 목록 분기
  const listToDisplay = view === "following" ? followings : followers;

  return (
    <div>
      {/* 토글 (팔로잉 / 팔로워) */}
      <div className="flex items-center justify-center mb-4">
        <Toggle
          id="view-toggle"
          label=""
          isChecked={isChecked}
          onToggle={(checked) => handleToggleChange(checked)}
          marginClassName=""
          checkedBgClass="bg-pink-500"
          uncheckedBgClass="bg-blue-500"
          aText="팔로잉"
          bText="팔로워"
        />
      </div>

      {/* 친구 목록 */}
      <div className="flex flex-col items-center justify-center">
        {(listToDisplay || []).map((friend, index) => {
          // profilePicture가 없거나 'string'이면 기본 이미지로 대체
          const profileImage =
            !friend.profilePicture || friend.profilePicture === "string"
              ? DefaultImage
              : friend.profilePicture;

          return (
            <FriendComponent
              key={index}
              name={
                friend.name.length > 6
                  ? friend.name.slice(0, 6) + "..."
                  : friend.name
              }
              isOnline={friend.isActive}
              profilePicture={profileImage}
              onClick={() => handleFriendClick(friend.followingId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FriendsListComponent;
