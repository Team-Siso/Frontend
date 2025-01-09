import { useNavigate } from "react-router-dom"; // useNavigate 훅을 import
import TodayComponent from "./TodayComponent";
import TodoListComponent_Friend from "./TodoListComponent_Friend";
import MyGoalComponent_Friend from "./MyGoalComponent_Friend";
import MyProfileComponent_Friend from "./MyProfileComponent_Friend";

interface ListSidebarFriendProps {
  friendId: number; // friendId를 숫자로 받음
}

const ListSidebar_Friend: React.FC<ListSidebarFriendProps> = ({ friendId }) => {
  const navigate = useNavigate(); // navigate 훅 사용

  const goToMyPage = () => {
    navigate("/main"); // /main 경로로 이동
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between">
        <TodayComponent className="flex-none h-60" />
        <button
          onClick={goToMyPage} // /main 경로로 이동하는 이벤트 핸들러
          className="bg-purple-300 text-white text-sm py-2 px-4 rounded-full mr-4"
        >
          My page
        </button>
      </div>{" "}
      <div className="flex-grow flex flex-col">
        {/* TodoListComponent와 MyGoalComponent의 높이를 계산하여 설정 */}
        <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
          <TodoListComponent_Friend className="flex-none" friendId={friendId} />
        </div>
        <div className="flex-none" style={{ height: "calc((100vh - 60px - 120px) / 2)" }}>
          <MyGoalComponent_Friend className="flex-none" friendId={friendId} />
        </div>
      </div>
      <MyProfileComponent_Friend className="flex-none h-120" friendId={friendId} />
    </div>
  );
};

export default ListSidebar_Friend;
