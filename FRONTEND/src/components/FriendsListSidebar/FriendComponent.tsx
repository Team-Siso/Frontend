// 사이드바에 뜨는 친구 컴포넌트 입니다.
// 이 컴포넌트는 친구의 프로필 사진과, 친구의 이름, 진행여부(초록색점) 등으로 구성됩니다.

import React from "react";
import FriendsProfileEx from "../../assets/FriendsProfileEx.svg";

interface FriendComponentProps {
  name: string;
  isOnline: boolean;
}

const FriendComponent: React.FC<FriendComponentProps> = ({ name, isOnline }) => {
  return (
    <div>
      <div className="flex flex-col items-center relative">
        {" "}
        {/* relative 추가 */}
        <img src={FriendsProfileEx} alt="Friend's Profile" className="w-10 h-10 rounded-full" />
        {isOnline && (
          <span className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0 mb-0.1 mr-0.1"></span>

          // absolute와 위치 조정 클래스 추가
        )}
      </div>
      <div className="flex flex-col items-center relative">
        <span className="mt-0.5 mb-1 text-xxs">{name}</span>
      </div>
    </div>
  );
};

export default FriendComponent;
