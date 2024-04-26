// App.tsx
import React from "react";
import CustomCalendar from "./components/CustomCalendar";
import FriendsListSidebar from "./components/FriendsListSidebar";
import ListSidebar from "./components/ListSidebar";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <FriendsListSidebar />
      <ListSidebar />
      <CustomCalendar />
    </div>
  );
}

export default App;
