import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Input from '../Input';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const params = new URLSearchParams({
      email,
      password,
    });

    try {
      const response = await fetch(`http://localhost:8080/api/v1/members/login?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      console.log('로그인 성공:', data);
      onClose(); // 로그인 성공 후 모달 닫기
      navigate('/main'); // 로그인 성공 후 메인 페이지로 이동
    } catch (error) {
      console.error('Error:', error);
      alert('로그인 실패');
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
          onChange={(e) => setEmail(e.target.value)} // Set email to the value entered by the user
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
          onChange={(e) => setPassword(e.target.value)} // Set password to the value entered by the user
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
