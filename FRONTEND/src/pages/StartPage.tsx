import { useState } from "react";
import { useStore } from "../store"; // 명명된 내보내기를 사용합니다
import SignUpModal from "../components/Modal/SignUpModal";
import LoginModal from "../components/Modal/LoginModal";
import StartPB from "../assets/StartPB.png"; // 상대 경로로 배경 이미지 불러오기

const StartPage = () => {
  const email = useStore((state) => state.email);
  const setEmail = useStore((state) => state.setEmail);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const validateEmail = async () => {
    try {
      const response = await fetch(
        `https://siiso.site/api/v1/members/valid?email=${encodeURIComponent(email)}`
      );
      const responseBody = await response.text();

      if (response.status === 400) {
        alert("이메일이 유효하지 않습니다. 다른 이메일을 입력해주세요.");
        return;
      }
      if (responseBody === "사용 가능한 이메일 입니다.") {
        openSignUpModal();
        console.log("성공");

        // 여기에서 모달 열기 등의 추가 작업 수행
      } else {
      }
    } catch (error) {
      console.error("유효성 검사 에러:", error);
    }
  };
  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

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
