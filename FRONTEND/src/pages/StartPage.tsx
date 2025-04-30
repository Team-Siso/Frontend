import React, { useState } from "react";
import SignUpModal from "../components/Modal/SignUpModal";
import LoginModal from "../components/Modal/LoginModal";
import StartPB from "../assets/StartPB.webp";
import { useAuthStore } from "../store/auth/useAuthStore";
import { validateEmailApi } from "../api/auth";

const StartPage: React.FC = () => {
  const email = useAuthStore((state) => state.email);
  const setEmail = useAuthStore((state) => state.setEmail);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const validateEmail = async () => {
    try {
      const response = await validateEmailApi(email);
      // response가 "사용 가능한 이메일 입니다." 문자열이라면
      if (response === "사용 가능한 이메일 입니다.") {
        openSignUpModal();
        console.log("이메일 유효성 검사 성공");
      } else {
        alert("이메일이 유효하지 않습니다. 다른 이메일을 입력해주세요.");
      }
    } catch (error) {
      console.error("유효성 검사 에러:", error);
    }
  };

  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${StartPB})` }}
    >
      <div className="mt-auto mb-16 flex flex-col items-center">
        <div className="flex items-center mb-4">
          <input
            type="email"
            placeholder="이메일 주소"
            className="p-3 text-lg border border-gray-300 rounded-l w-96"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mx-3"></div>
          <button
            className="px-5 py-3 text-lg text-white bg-blue-400 rounded hover:bg-blue-500"
            onClick={validateEmail}
          >
            시작하기
          </button>
        </div>
        <button
          className="px-5 py-3 text-lg text-white bg-gray-400 rounded-xl hover:bg-gray-500"
          onClick={openLoginModal}
        >
          로그인하러가기
        </button>
      </div>
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default StartPage;
