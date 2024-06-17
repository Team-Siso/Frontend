import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Input from '../Input';
import { useStore } from '../../store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const email = useStore((state) => state.email);
  const setEmail = useStore((state) => state.setEmail);
  const password = useStore((state) => state.password);
  const setPassword = useStore((state) => state.setPassword);
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      onClose(); // 로그인 성공 후 모달 닫기
      const memberId = useStore.getState().memberId; // 로그인 성공 시 저장된 memberId 가져오기
      navigate(`/main/${memberId}`); // 로그인 성공 후 해당 멤버의 메인 페이지로 이동
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      // 로그인 실패 시 메인 페이지로 이동하지 않음
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
          placeholder="이메일 입력 조건"
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
          placeholder="비밀번호 입력 조건"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleLogin}
      >
        확인
      </button>
    </Modal>
  );
};

export default LoginModal;
