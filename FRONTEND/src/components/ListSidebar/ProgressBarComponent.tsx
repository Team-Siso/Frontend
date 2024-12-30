import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

import ProgressBar_0 from "@/assets/ProgressBar_0.svg";
import ProgressBar_20 from "@/assets/ProgressBar_20.svg";
import ProgressBar_40 from "@/assets/ProgressBar_40.svg";
import ProgressBar_60 from "@/assets/ProgressBar_60.svg";
import ProgressBar_80 from "@/assets/ProgressBar_80.svg";
import ProgressBar_100 from "@/assets/ProgressBar_100.svg";
import ProgressBar_Empty from "@/assets/ProgressBar_Empty.svg";
import HeartImage_0 from "@/assets/HeartImage_0.svg";
import HeartImage_20 from "@/assets/HeartImage_20.svg";
import HeartImage_40 from "@/assets/HeartImage_40.svg";
import HeartImage_60 from "@/assets/HeartImage_60.svg";
import HeartImage_80 from "@/assets/HeartImage_80.svg";
import HeartImage_100 from "@/assets/HeartImage_100.svg";

interface ProgressBarComponentProps {
  title: string;
  goalId: number;
}

const setEditGoal = async (title: string, goalId: number, progress: number) => {
  try {
    const response = await fetch(`https://siiso.site/api/v1/goals/${goalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"title": "${title}", "progress": ${progress}}`,
    });

    if (!response.ok) {
      throw new Error("Failed to set goal");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to set goal");
    throw error;
  }
};

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({ goalId, title }) => {
  const { goals, fetchGoals, memberId } = useStore();
  const [progress, setProgress] = useState(ProgressBar_Empty);

  useEffect(() => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setProgressImage(goal.progress);
    }
  }, [goalId, goals]);

  const setProgressImage = (percent: number) => {
    switch (percent) {
      case 0:
        setProgress(ProgressBar_0);
        break;
      case 20:
        setProgress(ProgressBar_20);
        break;
      case 40:
        setProgress(ProgressBar_40);
        break;
      case 60:
        setProgress(ProgressBar_60);
        break;
      case 80:
        setProgress(ProgressBar_80);
        break;
      case 100:
        setProgress(ProgressBar_100);
        break;
      default:
        setProgress(ProgressBar_Empty);
    }
  };

  const handleHeartClick = async (percent: number) => {
    try {
      await setEditGoal(title, goalId, percent);
      setProgressImage(percent);
      if (memberId) {
        fetchGoals(memberId); // fetchGoals 호출하여 목표 목록 갱신
      }
      console.log(`${percent}% 선택됨`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update progress");
    }
  };

  const heartImages = {
    0: HeartImage_0,
    20: HeartImage_20,
    40: HeartImage_40,
    60: HeartImage_60,
    80: HeartImage_80,
    100: HeartImage_100,
  };

  return (
    <div className="relative w-full h-12">
      <img src={progress} alt="Progress Bar" className="absolute top-0 left-0 w-full h-full" />
      {[0, 20, 40, 60, 80, 100].map((percent, index) => (
        <button
          key={index}
          className="absolute"
          style={{ left: `calc(${percent}% - ${percent * 0.31}px + 7px)`, top: "11px" }} // 하트 이미지가 중앙에 오도록 조정
          onClick={() => handleHeartClick(percent)}
        >
          <img src={heartImages[percent]} alt={`${percent}% Heart`} className="w-3.5 h-3.5" />{" "}
          {/* 크기 조정 */}
        </button>
      ))}
    </div>
  );
};

export default ProgressBarComponent;
