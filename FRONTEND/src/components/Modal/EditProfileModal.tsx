import React, { useState } from 'react';
import Modal from './Modal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const [nickname, setNickname] = useState('닉네임');
  const [email, setEmail] = useState('email@example.com');
  const [bio, setBio] = useState('자기소개를 입력하세요!');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100'); // 기본 프로필 이미지

  const handleSave = () => {
    // 저장 로직 추가
    onClose();
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const openFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 w-128">
        <h2 className="text-xl font-bold mb-4 text-center">프로필 수정</h2>
        <div className="mb-4 flex justify-center items-center relative">
          <div className="relative cursor-pointer" onClick={openFileInput}>
            <img src={profilePic} alt="Profile" className="rounded-full w-30 h-30" />
            <input
              type="file"
              accept="image/*"
              id="file-input"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-3 w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
