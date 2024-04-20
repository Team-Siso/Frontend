import React, { useState } from 'react';
import Modal from './Modal';
import Input from '../Input'
import profileImage from '../../assets/profile.png';
import cameraIcon from '../../assets/camera.png';

interface SignUpModalStep2Props {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModalStep2: React.FC<SignUpModalStep2Props> = ({ isOpen, onClose }) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      
      <div className="relative flex flex-col items-center mb-4">
        <img src={profileImage} alt="Profile" className="rounded-full w-24 h-24" />
        <img 
          src={cameraIcon} 
          alt="Edit profile" 
          className="absolute bottom-4 right-21 w-10 h-10 cursor-pointer" 
          style={{ transform: 'translate(50%, 50%)' }} 
          onClick={() => {  }}
        />
      </div>

      <div className="flex items-center mb-4">
        <Input
          id="nickname"
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button style={{ marginTop: '-12px' }} className="w-16 h-8 bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded text-xs">
          확인
        </button>
      </div>

      <div className="flex items-center mb-6">
        <Input
          id="bio"
          type="text"
          placeholder="자기소개를 입력하세요"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button style={{ marginTop: '-12px' }} className="w-16 h-8 bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded text-xs">
          확인
        </button>
      </div>

      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
      >
        확인
      </button>
    </Modal>
  );
};

export default SignUpModalStep2;
