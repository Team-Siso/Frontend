import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import Modal from "./Modal";
import Input from "../Input";
import { useStore } from "../../store"; 

// LoginModal 컴포넌트의 props 인터페이스
interface LoginModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 로그인 모달 컴포넌트
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // Zustand 상태와 메서드 가져오기
  const email = useStore((state) => state.email); // 이메일 상태
  const setEmail = useStore((state) => state.setEmail); // 이메일 상태 업데이트 메서드
  const password = useStore((state) => state.password); // 비밀번호 상태
  const setPassword = useStore((state) => state.setPassword); // 비밀번호 상태 업데이트 메서드
  const login = useStore((state) => state.login); // 로그인 메서드
  const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅

  // 로그인 버튼 클릭 핸들러
  const handleLogin = async () => {
    try {
      // 로그인 메서드 호출
      await login(email, password);
      onClose(); // 로그인 성공 시 모달 닫기
      navigate('/main'); // 로그인 성공 후 메인 페이지로 이동
    } catch (error) {
      console.error('로그인 실패:', error); // 오류 로그 출력
      alert('로그인에 실패했습니다. 다시 시도해주세요.'); // 오류 알림
      // 실패 시 메인 페이지로 이동하지 않음
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* 모달 헤더 */}
      <h2 className="text-2xl font-bold mb-8">로그인</h2>

      {/* 이메일 입력 필드 */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-base font-medium text-left">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일 입력 조건" // 이메일 입력 조건을 안내하는 플레이스홀더
          value={email} // Zustand 이메일 상태 바인딩
          onChange={(e) => setEmail(e.target.value)} // 입력 값 업데이트
        />
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-base font-medium text-left">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호 입력 조건" // 비밀번호 입력 조건을 안내하는 플레이스홀더
          value={password} // Zustand 비밀번호 상태 바인딩
          onChange={(e) => setPassword(e.target.value)} // 입력 값 업데이트
        />
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleLogin} // 로그인 핸들러 호출
      >
        확인
      </button>
    </Modal>
  );
};

export default LoginModal;