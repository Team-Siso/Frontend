import { useState } from "react";
import { useStore } from "@/store";

const ToggleComponent = () => {
  const [isOn, setIsOn] = useState(false);
  const memberId = useStore((state) => state.memberId);
  const handleToggle = async () => {
    if (!memberId) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    console.log("memberId:", memberId);
    setIsOn((prev) => !prev);
    try {
      if (!isOn) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/follows/${memberId}/following`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          response.json().then((data) => console.log(data));
        }
        if (!response.ok) throw new Error("팔로잉 API 호출 실패");
        console.log("팔로잉 성공");
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/follows/${memberId}/followers`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          response.json().then((data) => console.log(data));
        }
        if (!response.ok) throw new Error("팔로잉 API 호출 실패");
        console.log("팔로워 보이기 성공");
      }
    } catch (error) {}
  };
  return (
    <div className="relative mb-12 flex justify-center " onClick={handleToggle}>
      <div
        className={`w-12 h-7 flex  rounded-full transition-colors duration-500 ${isOn ? "bg-blue-600 justify-end" : "bg-gray-400 justify-start"}`}
      ></div>
      <button
        className={`absolute top-0.5 w-6 h-6 flex rounded-full bg-white transition-transform duration-500 ${
          isOn ? "translate-x-6" : "translate-x-0.5"
        }`}
      ></button>
    </div>
  );
};

export default ToggleComponent;
