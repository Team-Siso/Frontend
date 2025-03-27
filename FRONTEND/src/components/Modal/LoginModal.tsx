import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Input from "../Input";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useLoginMutation } from "../../hooks/auth/useLogin";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { email, setEmail, password, setPassword } = useAuthStore();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      loginMutation.mutate({ email, password });
      onClose();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-8">로그인</h2>

      <div className="mb-4">
        <label htmlFor="email" className="block text-base font-medium text-left">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-base font-medium text-left">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleLogin}
        disabled={loginMutation.status === "pending"}
      >
        {loginMutation.status === "pending" ? "로그인 중..." : "확인"}
      </button>
    </Modal>
  );
};

export default LoginModal;
