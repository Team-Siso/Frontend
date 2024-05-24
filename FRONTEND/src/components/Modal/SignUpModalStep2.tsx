import React, { useState } from 'react';
import Modal from './Modal';
import Input from '../Input';
import profileImage from '../../assets/profile.png';
import cameraIcon from '../../assets/camera.png';

interface SignUpModalStep2Props {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password: string;
}

const SignUpModalStep2: React.FC<SignUpModalStep2Props> = ({ isOpen, onClose, email, password }) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(profileImage);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    const memberPhoto = profilePic; // 실제 업로드된 이미지 URL을 사용해야 함

    const requestBody = {
      email,
      password,
      introduce: bio,
      nickName: nickname,
      memberPhoto,
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/members/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }

      const data = await response.json();
      console.log('회원가입 성공:', data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 실패');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      
      <div className="relative flex flex-col items-center mb-4">
        <img src={profilePic} alt="Profile" className="rounded-full w-24 h-24" />
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="profile-pic-input" 
          onChange={handleProfilePicChange} 
        />
        <img 
          src={cameraIcon} 
          alt="Edit profile" 
          className="absolute bottom-4 right-21 w-10 h-10 cursor-pointer" 
          style={{ transform: 'translate(50%, 50%)' }} 
          onClick={() => document.getElementById('profile-pic-input')?.click()} 
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
        onClick={handleSubmit}
      >
        확인
      </button>
    </Modal>
  );
};

export default SignUpModalStep2;
