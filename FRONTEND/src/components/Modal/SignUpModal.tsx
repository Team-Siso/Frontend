import React from "react";
import Modal from "./Modal";
import Input from "../Input";
import SignUpModalStep2 from "./SignUpModalStep2";
import { useSignUpModal } from "../../hooks/modals/useSignUpModal";
import { useSignUpStore } from "../../store/modals/useSignUpStore";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { password, confirmPassword, setPassword, setConfirmPassword, isStep2Open, setIsStep2Open } =
    useSignUpStore();
  const { openStep2 } = useSignUpModal(onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-8">회원가입</h2>

      <div className="mb-4">
        <label htmlFor="password">비밀번호</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirm-password">비밀번호 확인</label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
        />
      </div>

      <button
        type="button"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => setIsStep2Open(true)} // Step2 모달 열기
      >
        다음
      </button>

      <SignUpModalStep2 isOpen={isStep2Open} onClose={() => setIsStep2Open(false)} />
    </Modal>
  );
};

export default SignUpModal;
