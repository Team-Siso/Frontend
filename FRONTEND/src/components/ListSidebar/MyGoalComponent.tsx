import React, { useState } from "react";
import { useStore } from "@/store";
import PlusButton from "@/assets/PlusButton.svg";
import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import ProgressBarComponent from "./ProgressBarComponent";
import { useGoalsQuery } from "@/hooks/goal/useGoalsQuery";
import { useAddGoal } from "@/hooks/goal/useAddGoal";
import { useToggleGoalCompletion } from "@/hooks/goal/useToggleGoalCompletion";
import { useUpdateGoal } from "@/hooks/goal/useUpdateGoal";
import { useDeleteGoal } from "@/hooks/goal/useDeleteGoal";

interface MyGoalComponentProps {
  className: string;
}

const MyGoalComponent: React.FC<MyGoalComponentProps> = ({ className }) => {
  const [showInput, setShowInput] = useState(false); // 새로운 목표를 추가하기 위한 입력 필드의 가시성을 제어하는 상태
  const [inputValue, setInputValue] = useState(""); // 입력 상자의 현재 값을 저장할 상태
  const [editId, setEditId] = useState<number | null>(null); // 편집 중인 목표의 ID를 저장하는 상태
  const [editText, setEditText] = useState(""); // 편집 중인 목표의 텍스트를 저장하는 상태
  const [showEditOptions, setShowEditOptions] = useState<number | null>(null); // 호버 중인 항목의 ID를 저장하는 상태

  const { memberId } = useStore((state) => ({
    memberId: state.memberId,
  }));

  const { data: goals = [], isLoading, isError } = useGoalsQuery(String(memberId));
  const { mutate: addGoal } = useAddGoal(String(memberId));
  const { mutate: toggleCompletion } = useToggleGoalCompletion(String(memberId));
  const { mutate: updateGoalMutate } = useUpdateGoal(String(memberId));
  const { mutate: deleteGoalMutate } = useDeleteGoal(String(memberId));
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
      addGoal(inputValue);
      setInputValue("");
      setShowInput(false);
    }
    console.log(
      "입력필드에서 enter키를 누르거나 추가 버튼을 클릭했습니다. 새로운 목표를 추가합니다."
    );
  };

  const toggleTodoCompletion = (id: number) => {
    // 목표의 완료 상태를 토글합니다.
    toggleCompletion(id);
  };

  const handleDelete = (id: number) => {
    // 목표를 삭제합니다.
    deleteGoalMutate(id);
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
    // 현재 편집 중인 목표의 progress 값을 가져오기
    const goal = goals.find((goal) => goal.id === id);
    const progress = goal ? goal.progress : 0;

    updateGoalMutate(
      { id, title: editText, progress },
      {
        onSuccess: () => {
          setEditId(null);
          console.log("목표 수정 성공");
        },
        onError: (err) => {
          console.error("목표 수정 실패:", err);
        },
      }
    );
  };
  if (isLoading) return <div>목표를 불러오는 중입니다...</div>;
  if (isError) return <div>목표를 불러오는 데 실패했습니다.</div>;

  return (
    <div className={`${className}`}>
      <hr className="mx-4 my-1 border-gray-300" />
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">My Goal</div>
        <div className="flex items-center pr-2">
          <img src={PlusButton} alt="Add My Goal" onClick={handleIconClick} />
        </div>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: "calc(43vh - 60px - 40px)", // 부모 높이에서 텍스트 영역과 입력 영역 제외
          flexGrow: 1, // 나머지 공간을 차지하도록 설정
        }}
      >
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
                      onKeyPress={(event) =>
                        event.key === "Enter" ? handleEditSave(goal.id) : null
                      }
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
    </div>
  );
};

export default MyGoalComponent;
