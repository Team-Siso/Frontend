import React from "react";
import CustomCalender from "./components/CustomCalender";
import FriendsListSidebar from "./components/FriendsListSidebar/FriendsListSidebar";
import ListSidebar from "./components/ListSidebar/ListSidebar";

const App = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      height: "100vh", // 전체 뷰포트 높이를 사용
      width: "100vw", // 전체 뷰포트 너비를 사용
      overflow: "hidden", // 스크롤 방지
    }}
  >
    {" "}
    <FriendsListSidebar />
    <ListSidebar />
    <CustomCalender />
  </div>
);

export default App;
