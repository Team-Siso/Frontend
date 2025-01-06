import TodayComponent from "./TodayComponent";
import TodoListComponent_Friend from "./TodoListComponent_Friend";
import MyGoalComponent_Friend from "./MyGoalComponent_Friend";
import MyProfileComponent_Friend from "./MyProfileComponent_Friend";

const ListSidebar_Friend = () => (
  <div className="flex flex-col h-screen">
    <TodayComponent className="flex-none h-60" />{" "}
    <div className="flex-grow flex flex-col">
      {/* TodoListComponent와 MyGoalComponent의 높이를 계산하여 설정 */}
      <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
        <TodoListComponent_Friend className="flex-none" />
      </div>
      <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
        <MyGoalComponent_Friend className="flex-none" />
      </div>
    </div>
    <MyProfileComponent_Friend className="flex-none h-120" />
  </div>
);

export default ListSidebar_Friend;
