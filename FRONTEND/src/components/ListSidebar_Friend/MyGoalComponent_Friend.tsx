import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import ProgressBarComponent_Friend from "./ProgressBarComponent_Friend";

interface MyGoalComponentProps {
  className?: string;
  friendId: number; // friendId를 숫자로 받음
}

const MyGoalComponent_Friend: React.FC<MyGoalComponentProps> = ({ className, friendId }) => {
  const { goals, fetchGoals } = useStore((state) => ({
    goals: state.goals,
    fetchGoals: state.fetchGoals,
  }));

  useEffect(() => {
    if (friendId) {
      fetchGoals(friendId);
      console.log("fetchGoals 성공, memberId : ", friendId);
    }
  }, [friendId, fetchGoals]);
  const [profile, setProfile] = useState({
    nickname: "",
  });

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
  return (
    <div className={`${className}`}>
      <hr className="mx-4 my-1 border-gray-300" />
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">{profile.nickname}'s Goal</div>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: "calc(43vh - 60px - 40px)", // 부모 높이에서 텍스트 영역과 입력 영역 제외
          flexGrow: 1, // 나머지 공간을 차지하도록 설정
        }}
      >
        <ul className="divide-y divide-gray-300 mx-4">
          {goals.map((goal) => (
            <li key={goal.id} className="flex flex-col py-3 pl-2 pr-2 relative">
              <div className="flex items-center">
                <img
                  src={goal.completed ? CheckedBoxIcon : UncheckBoxIcon}
                  alt={goal.completed ? "Goal completed" : "Mark goal as completed"}
                  className="cursor-pointer"
                />
                <span className={goal.completed ? "ml-2 line-through" : "ml-2"}> {goal.title}</span>
              </div>
              <ProgressBarComponent_Friend goalId={goal.id} title={goal.title} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyGoalComponent_Friend;
