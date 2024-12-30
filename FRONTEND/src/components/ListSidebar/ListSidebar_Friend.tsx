import TodayComponent from "./TodayComponent";
// import TodoListComponent_Friend from "./TodoListComponent_Friend";
import MyGoalComponent_Friend from "./MyGoalComponent_Friend";
// import MyProfileComponent_Friend from "./MyProfileComponent_Friend";

const ListSidebar_Friend = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none h-60" />{" "}
    <div className="flex-grow flex flex-col">
      {/* <TodoListComponent_Friend className="flex-grow" /> */}
      <MyGoalComponent_Friend className="flex-grow" />
    </div>
    {/* <MyProfileComponent_Friend className="flex-none h-120" /> */}
  </div>
);

export default ListSidebar_Friend;
