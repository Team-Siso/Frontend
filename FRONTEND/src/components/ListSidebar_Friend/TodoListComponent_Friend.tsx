import { useState, useEffect } from "react";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";
interface TodoListComponentFriendProps {
  className?: string;
  friendId: number; // friendId를 숫자로 받음
}
const TodoListComponent_Friend: React.FC<TodoListComponentFriendProps> = ({
  className,
  friendId,
}) => {
  // const memberId = useStore((state) => state.memberId);
  const [profile, setProfile] = useState({
    nickname: "",
  });
  const schedules = useStore((s) => s.schedules);
  const selectedDate = useStore((s) => s.selectedDate);
  const fetchSchedulesByDate = useStore((s) => s.fetchSchedulesByDate);
  const filteredTodos = schedules
    .filter((td) => td.thisDay?.split("T")[0] === selectedDate)
    .sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime < b.startTime ? -1 : 1;
    });
  useEffect(() => {
    if (friendId && selectedDate) {
      fetchSchedulesByDate(friendId, selectedDate);
    }
  }, [friendId, selectedDate]);
  useEffect(() => {
    const fetchProfile = async () => {
      if (friendId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${friendId}`, {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfile({
              nickname: data.nickname || "",
            });
          } else {
            console.error("프로필 불러오기 실패:", response.status);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchProfile();
  }, [friendId]);

  const todos = useStore((state) => state.schedules) || []; // store에서 todos 가져오기
  const fetchSchedules = useStore((state) => state.fetchSchedules);
  const setSchedules = useStore((state) => state.setSchedules); // setSchedules를 올바르게 가져오기

  useEffect(() => {
    console.log("friendId:", friendId);
    console.log("Updated Schedules:", todos);

    if (friendId) {
      fetchSchedules(friendId)
        .then(() => {
          // fetchSchedules는 void를 반환하므로 별도 처리 불필요
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [friendId, fetchSchedules, setSchedules]);

  return (
    <div className={`${className} `}>
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">{profile.nickname}'s Todos</div>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: "calc(43vh - 60px - 40px)", // 부모 높이에서 텍스트 영역과 입력 영역 제외
          flexGrow: 1, // 나머지 공간을 차지하도록 설정
        }}
      >
        <ul className="divide-y divide-gray-300 mx-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <li key={todo.id} className="flex items-center py-3 pl-2 pr-2 relative">
                {/* 체크박스 */}
                <img
                  src={todo.checkStatus === 1 ? CheckedBoxIcon : UncheckBoxIcon}
                  alt={todo.checkStatus === 1 ? "Todo completed" : "Mark todo as completed"}
                  className="cursor-pointer"
                />

                {/* Todo 텍스트 */}
                <span className={todo.completed ? "ml-2 line-through" : "ml-2"}>
                  {todo.content}
                </span>
              </li>
            ))
          ) : (
            <li className="text-center py-3 text-gray-500">할 일이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoListComponent_Friend;
