import RestTasksComponent from "./RestTasksComponent";
import LogoComponent from "./LogoComponent";
import NextPageComponent from "./NextPageComponent";
import FriendsListComponent from "./FriendsListComponent";

const FriendsListSidebar = () => (
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
        <NextPageComponent />
      </div>
    </div>
  </div>
);

export default FriendsListSidebar;
