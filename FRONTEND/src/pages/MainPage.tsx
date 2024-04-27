import React from "react";
import CustomCalender from "../components/CustomCalender";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";

const MainPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <FriendsListSidebar />
      <ListSidebar />
      <CustomCalender />
    </div>
  );
};

export default MainPage;
