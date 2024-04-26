import React from "react";
import CustomCalender from "./components/CustomCalender";
import FriendsListSidebar from "./components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "./components/ListSidebar/ListSidebar";

const App = () => (
  <div style={{ display: "flex", flexDirection: "row" }}>
    <FriendsListSidebar />
    <ListSidebar />
    <CustomCalender />
  </div>
);

export default App;
