import React from "react";
import TodoTodoCloudImage from "../assets/TodoTodoCloudImage.svg";

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-blueD0DDF2">
      <img src={TodoTodoCloudImage} alt="TodoTodo" className="mb-8" />
      <div className="flex items-center mb-4">
        <input
          type="email"
          placeholder="이메일 주소"
          className="p-2 border border-gray-300 rounded-l w-80"
        />
        <div className="mx-2"></div>
        <button className="px-4 py-2 text-white bg-blue7580DB rounded">시작하기</button>
      </div>
      <button className="px-4 py-2 text-white bg-gray9E9E9E rounded-xl">로그인하러가기</button>
    </div>
  );
};

export default StartPage;
