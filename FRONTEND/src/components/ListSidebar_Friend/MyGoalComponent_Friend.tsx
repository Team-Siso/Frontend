import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import ProgressBarComponent_Friend from "./ProgressBarComponent_Friend";

interface MyGoalComponentProps {
  className: string;
}

const MyGoalComponent_Friend: React.FC<MyGoalComponentProps> = ({ className }) => {
  const { goals, fetchGoals, memberId } = useStore((state) => ({
    goals: state.goals,
    setGoal: state.setGoal,
    fetchGoals: state.fetchGoals,
    memberId: state.memberId,
  }));

  useEffect(() => {
    if (memberId) {
      fetchGoals(memberId);
      console.log("fetchGoals 성공, memberId : ", memberId);
    }
  }, [memberId, fetchGoals]);
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
  return (
    <div className={`${className}`}>
      <hr className="mx-4 my-1 border-gray-300" />
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">{profile.nickname}'s Goal</div>
      </div>

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
  );
};

export default MyGoalComponent_Friend;
