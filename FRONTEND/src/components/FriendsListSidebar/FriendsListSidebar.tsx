import RestTasksComponent from "./RestTasksComponent";
import LogoComponent from "./LogoComponent";
import NextPageComponent from "./NextPageComponent";
import FriendsListComponent from "./FriendsListComponent";
import { useStore } from "@/store";
import { useState } from "react";

const FriendsListSidebar = () => {
  const { followings } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNextFriend = () => {
    if (currentIndex < followings.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isOverFive = followings.length > 5;
  const displayedFriends = isOverFive ? [followings[currentIndex]] : followings;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div>
        <LogoComponent />
      </div>
      <div>
        <RestTasksComponent tasksCount={7} />
      </div>
      <div className="flex justify-center items-center">
        <div>
          <FriendsListComponent />
          <div className=" top-1/2">
            <NextPageComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsListSidebar;
