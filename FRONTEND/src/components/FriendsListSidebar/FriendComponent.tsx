import React from "react";

interface FriendComponentProps {
  name: string;
  isOnline: boolean;
  profilePicture: string;
  onClick: () => void;
}

const FriendComponent: React.FC<FriendComponentProps> = ({
  name,
  isOnline,
  profilePicture,
  onClick,
}) => {
  return (
    <button
      className="friend-component"
      onClick={onClick} // 클릭 이벤트 처리
      style={{ cursor: "pointer" }}
    >
      <div className="flex flex-col items-center relative">
        <img src={profilePicture} alt="Friend's Profile" className="w-10 h-10 rounded-full" />
        {isOnline && (
          <span className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0 mb-0.1 mr-0.1"></span>
        )}
      </div>
      <div className="flex flex-col items-center relative">
        <span className="mt-0.5 mb-1 text-xxs">{name}</span>
      </div>
    </button>
  );
};

export default FriendComponent;
