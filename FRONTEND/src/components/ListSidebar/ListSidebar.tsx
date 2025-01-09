import TodayComponent from "./TodayComponent";
import TodoListComponent from "./TodoListComponent";
import MyGoalComponent from "./MyGoalComponent";
import MyProfileComponent from "./MyProfileComponent";

const ListSidebar = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none h-60" />{" "}
    <div className="flex-grow flex flex-col">
      {/* TodoListComponent와 MyGoalComponent의 높이를 계산하여 설정 */}
      <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
        <TodoListComponent className="flex-none" />
      </div>
      <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
        <MyGoalComponent className="flex-none" />
      </div>
    </div>
    <MyProfileComponent className="flex-none h-120" />
  </div>
);

export default ListSidebar;
