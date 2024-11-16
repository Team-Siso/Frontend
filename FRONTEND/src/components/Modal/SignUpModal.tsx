import React, { useState } from "react";
import Modal from "./Modal";
import Input from "../Input";
import SignUpModalStep2 from "./SignUpModalStep2";
import { useStore } from "../../store";

// SignUpModal 컴포넌트의 props 인터페이스 정의
interface SignUpModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 회원가입 모달 컴포넌트 정의
const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  // Zustand에서 상태 및 메서드 가져오기
  const password = useStore((state) => state.password); // 비밀번호 상태
  const setPassword = useStore((state) => state.setPassword); // 비밀번호 업데이트 메서드
  const confirmPassword = useStore((state) => state.confirmPassword); // 비밀번호 확인 상태
  const setConfirmPassword = useStore((state) => state.setConfirmPassword); // 비밀번호 확인 업데이트 메서드

  // 2단계 모달 열림 여부 상태
  const [isStep2Open, setIsStep2Open] = useState(false);

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // 비밀번호 상태 업데이트
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value); // 비밀번호 확인 상태 업데이트
  };

  // 2단계 모달 열기
  const openStep2 = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match"); // 비밀번호 불일치 경고
      return;
    }
    setIsStep2Open(true); // 2단계 모달 열림 상태로 설정
  };

  // 2단계 모달 닫기
  const closeStep2 = () => {
    setIsStep2Open(false); // 2단계 모달 닫힘 상태로 설정
    onClose(); // 회원가입 모달도 닫기
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* 모달 헤더 */}
      <h2 className="text-2xl font-bold mb-8">회원가입</h2>

      {/* 비밀번호 입력 필드 */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-base font-medium text-left">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호 조건" // 비밀번호 입력 조건 안내
          value={password} // Zustand 비밀번호 상태 바인딩
          onChange={handlePasswordChange} // 비밀번호 입력 핸들러
        />
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="mb-6">
        <label htmlFor="confirm-password" className="block text-base font-medium text-left">
          비밀번호 확인
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요" // 비밀번호 확인 안내
          value={confirmPassword} // Zustand 비밀번호 확인 상태 바인딩
          onChange={handleConfirmPasswordChange} // 비밀번호 확인 입력 핸들러
        />
      </div>

      {/* 다음 단계 버튼 */}
      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={openStep2} // 다음 단계로 이동 핸들러
      >
        다음
      </button>

      {/* 회원가입 2단계 모달 */}
      <SignUpModalStep2 
        isOpen={isStep2Open} // 2단계 모달 열림 여부
        onClose={closeStep2} // 2단계 모달 닫기 핸들러
      />
    </Modal>
  );
};

export default SignUpModal;