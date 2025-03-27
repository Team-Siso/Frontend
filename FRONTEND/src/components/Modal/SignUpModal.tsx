import React, { useState } from "react";
import Modal from "./Modal";
import Input from "../Input";
import SignUpModalStep2 from "./SignUpModalStep2";
import { useAuthStore } from "../../store/auth/useAuthStore";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const password = useAuthStore((state) => state.password);
  const setPassword = useAuthStore((state) => state.setPassword);
  const confirmPassword = useAuthStore((state) => state.confirmPassword);
  const setConfirmPassword = useAuthStore((state) => state.setConfirmPassword);
  const [isStep2Open, setIsStep2Open] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const openStep2 = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsStep2Open(true);
  };

  const closeStep2 = () => {
    setIsStep2Open(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-8">회원가입</h2>

      <div className="mb-4">
        <label htmlFor="password" className="block text-base font-medium text-left">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호 조건"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirm-password" className="block text-base font-medium text-left">
          비밀번호 확인
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={openStep2}
      >
        다음
      </button>

      <SignUpModalStep2 isOpen={isStep2Open} onClose={closeStep2} />
    </Modal>
  );
};

export default SignUpModal;
