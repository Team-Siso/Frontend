import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import PlusButton from "@/assets/PlusButton.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import ProgressBarComponent from "./ProgressBarComponent";

interface MyGoalComponentProps {
  className: string;
}

const MyGoalComponent: React.FC<MyGoalComponentProps> = ({ className }) => {
  const [showInput, setShowInput] = useState(false); // 새로운 목표를 추가하기 위한 입력 필드의 가시성을 제어하는 상태
  const [inputValue, setInputValue] = useState(""); // 입력 상자의 현재 값을 저장할 상태
  const [editId, setEditId] = useState<number | null>(null); // 편집 중인 목표의 ID를 저장하는 상태
  const [editText, setEditText] = useState(""); // 편집 중인 목표의 텍스트를 저장하는 상태
  const [showEditOptions, setShowEditOptions] = useState<number | null>(null); // 호버 중인 항목의 ID를 저장하는 상태

  const { goals, setGoal, toggleGoalCompletion, fetchGoals, memberId } = useStore((state) => ({
    goals: state.goals,
    setGoal: state.setGoal,
    toggleGoalCompletion: state.toggleGoalCompletion,
    fetchGoals: state.fetchGoals,
    memberId: state.memberId,
  }));

  useEffect(() => {
    if (memberId) {
      fetchGoals(memberId);
      console.log("fetchGoals 성공, memberId : ", memberId);
    }
  }, [memberId, fetchGoals]);

  const handleIconClick = () => {
    // PlusButton 아이콘을 클릭하면 showInput 상태를 true로 설정하여 입력 필드를 표시합니다.
    console.log("PlusButton 클릭! 입력 필드를 표시할게요");
    setShowInput(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 필드의 값이 변경될 때 inputValue 상태를 업데이트합니다.
    setInputValue(event.target.value);
  };

  const handleAddGoal = () => {
    // 입력 필드에서 Enter 키를 누르거나 추가 버튼을 클릭하면 새로운 목표를 추가하고 입력 필드를 초기화합니다.
    if (inputValue.trim()) {
      setGoal(inputValue);
      setInputValue("");
      setShowInput(false);
    }
    console.log(
      "입력필드에서 enter키를 누르거나 추가 버튼을 클릭했습니다. 새로운 목표를 추가합니다."
    );
  };

  const toggleTodoCompletion = (id: number) => {
    // 목표의 완료 상태를 토글합니다.
    toggleGoalCompletion(id);
  };

  const deleteGoal = async (id: number) => {
    console.log("골 delete 입니다.");
    try {
      const response = await fetch(`http://43.203.231.200:8080/api/v1/goals/${id}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      });

      if (response.ok) {
        console.log("삭제 성공");
        fetchGoals(memberId); // 삭제 후 목표 목록 다시 불러오기
      } else {
        console.error("삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id: number) => {
    // 목표를 삭제합니다.
    console.log("handleDelete 입니다");
    deleteGoal(id);
  };

  const editGoal = async (id: number, title: string, progress: number) => {
    console.log("editGoal 호출, id:", id, "title:", title, "progress:", progress);
    try {
      const response = await fetch(`http://43.203.254.169:8080/api/v1/goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ title, progress }),
      });

      if (response.ok) {
        console.log("수정 성공");
        fetchGoals(memberId); // 수정 후 목표 목록 다시 불러오기
      } else {
        console.error("수정 실패:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startEdit = (id: number, title: string) => {
    // 목표의 편집 모드를 시작하고 편집 중인 목표의 ID와 텍스트를 설정합니다.
    console.log("startEdit 함수 호출, id:", id, "title:", title);
    setEditId(id);
    setEditText(title);
    setShowEditOptions(null); // 편집 시작 시, 편집 옵션 숨김
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 편집 중인 목표의 텍스트를 변경합니다.
    console.log("handelEditChange 함수 입니다.");
    setEditText(event.target.value);
  };

  const handleEditSave = async (id: number) => {
    // 목표의 텍스트 편집을 저장하고 편집 모드를 종료합니다.
    console.log("handleEditSave 함수 입니다.");

    // 현재 편집 중인 목표의 progress 값을 가져오기
    const goal = goals.find((goal) => goal.id === id);
    const progress = goal ? goal.progress : 0;

    await editGoal(id, editText, progress); // progress는 기본값으로 0으로 설정
    setEditId(null);
    console.log("목표 수정을 완료했습니다");
  };

  return (
    <div className={`${className}`}>
      <hr className="mx-4 my-1 border-gray-300" />
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">My Goal</div>
        <div className="flex items-center pr-2">
          <img src={PlusButton} alt="Add My Goal" onClick={handleIconClick} />
        </div>
      </div>
      {showInput && (
        <div className="">
          <input
            type="text"
            className="w-full p-3 pl-8 bg-grayEBEBEB"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => (event.key === "Enter" ? handleAddGoal() : null)}
          />
        </div>
      )}
      <ul className="divide-y divide-gray-300 mx-4">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="flex flex-col py-3 pl-2 pr-2 relative"
            onMouseOver={() => setShowEditOptions(goal.id)}
            onMouseLeave={() => setShowEditOptions(null)}
          >
            <div className="flex items-center">
              <img
                src={goal.completed ? CheckedBoxIcon : UncheckBoxIcon}
                alt={goal.completed ? "Goal completed" : "Mark goal as completed"}
                className="cursor-pointer"
                onClick={() => toggleTodoCompletion(goal.id)}
              />
              <span className={goal.completed ? "ml-2 line-through" : "ml-2"}>
                {goal.id === editId ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                    onBlur={() => handleEditSave(goal.id)}
                    onKeyPress={(event) => (event.key === "Enter" ? handleEditSave(goal.id) : null)}
                  />
                ) : (
                  goal.title
                )}
              </span>
            </div>
            <ProgressBarComponent goalId={goal.id} title={goal.title} />
            {showEditOptions === goal.id && (
              <div className="absolute right-0 top-0 rounded-lg">
                <button
                  className="px-2 py-1 border-b-2 border-r-2 mr-2 border-gray-300 rounded-lg text-sm"
                  onClick={() => startEdit(goal.id, goal.title)}
                >
                  수정
                </button>
                <button
                  className="px-2 py-1 border-b-2 border-gray-300 rounded-lg text-sm"
                  onClick={() => handleDelete(goal.id)}
                >
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyGoalComponent;
