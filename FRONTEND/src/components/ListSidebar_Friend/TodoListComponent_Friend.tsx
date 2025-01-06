import { useState, useEffect } from "react";

import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

const TodoListComponent_Friend = ({ className }) => {
  const memberId = useStore((state) => state.memberId);
  const [profile, setProfile] = useState({
    nickname: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (memberId) {
        try {
          const response = await fetch(`/api/v1/members/${memberId}`, {
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
  }, [memberId]);

  const todos = useStore((state) => state.schedules) || []; // store에서 todos 가져오기
  const fetchSchedules = useStore((state) => state.fetchSchedules);
  const setSchedules = useStore((state) => state.setSchedules); // setSchedules를 올바르게 가져오기

  useEffect(() => {
    console.log("memberId:", memberId); // memberId를 로그로 출력
    console.log("Updated Schedules:", todos);

    if (memberId) {
      fetchSchedules(memberId)
        .then(() => {
          // fetchSchedules는 void를 반환하므로 별도 처리 불필요
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [memberId, fetchSchedules, setSchedules]);

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
          {todos.length > 0 ? (
            todos.map((todo) => (
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
