import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import PlusButton from "@/assets/PlusButton.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import ProgressBarComponent from "../ListSidebar/ProgressBarComponent";

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

  return (
    <div className={`${className}`}>
      <hr className="mx-4 my-1 border-gray-300" />
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">My Goal</div>
        <div className="flex items-center pr-2">
          <img src={PlusButton} alt="Add My Goal" />
        </div>
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
            </div>
            <ProgressBarComponent goalId={goal.id} title={goal.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyGoalComponent_Friend;
