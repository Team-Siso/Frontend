import React from "react";

interface FriendComponentProps {
  name: string;
  isOnline: boolean;
  profilePicture: string;
}

const FriendComponent: React.FC<FriendComponentProps> = ({ name, isOnline, profilePicture }) => {
  console.log(isOnline);
  return (
    <div>
      <div className="flex flex-col items-center relative">
        <img src={profilePicture} alt="Friend's Profile" className="w-10 h-10 rounded-full" />
        <div
          className={`
      w-1 h-1 rounded-full absolute top-0 left-0 mb-0.1 mr-0.1
      ${isOnline ? "bg-green-500" : "bg-red-500"}
    `}
        />
      </div>
      <div className="flex flex-col items-center relative">
        <span className="mt-0.5 mb-1 text-xxs">{name}</span>
      </div>
    </div>
  );
};

export default React.memo(FriendComponent);
