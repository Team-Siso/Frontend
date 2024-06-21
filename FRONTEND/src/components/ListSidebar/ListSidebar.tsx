import TodayComponent from "./TodayComponent";
import TodoListComponent from "./TodoListComponent";
import MyGoalComponent from "./MyGoalComponent";
import MyProfileComponent from "./MyProfileComponent";

const ListSidebar = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none h-60" />{" "}
    <div className="flex-grow flex flex-col">
      <TodoListComponent className="flex-grow" />
      <MyGoalComponent className="flex-grow" />
    </div>
    <MyProfileComponent className="flex-none h-120" />
  </div>
);

export default ListSidebar;
