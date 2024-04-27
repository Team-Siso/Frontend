import React from "react";
import Custom from "../components/Calendar/CustomCalendar";
import FriendsListSidebar from "../components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "../components/ListSidebar/ListSidebar";
import CalendarEx from "../components/Calendar/CalendarEx";

const MainPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw" }}>
      <div style={{ flex: "1", maxWidth: "5%" }}>
        <FriendsListSidebar />
      </div>
      <div style={{ flex: "5", maxWidth: "25%" }}>
        <ListSidebar />
      </div>
      <div style={{ flex: "14", maxWidth: "70%" }}>
        <CalendarEx />
      </div>
    </div>
  );
};

export default MainPage;
