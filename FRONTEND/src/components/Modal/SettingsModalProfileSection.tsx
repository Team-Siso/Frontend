import React from 'react';
import profileImage from '../../assets/profile.png';
import penIcon from '../../assets/pen.png';
import EditProfileModal from './EditProfileModal';
import { useStore } from '../../store';

const ModalProfileSection: React.FC = () => {
  const isEditModalOpen = useStore((state) => state.isEditModalOpen);
  const setEditModalOpen = useStore((state) => state.setEditModalOpen);

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="flex items-center mb-6 text-left">
      <img src={profileImage} alt="Profile" className="rounded-full w-20 h-20 mr-5" />
      <div className="mr-10">
        <div className="flex items-center">
          <p className="text-lg font-bold mr-2">닉네임</p>
          <img src={penIcon} alt="Edit" className="w-4 h-4 cursor-pointer" onClick={openEditModal} />
        </div>
        <p className="text-sm text-gray-600">email@example.com</p>
        <p className="text-sm text-gray-500">자기소개를 입력하세요!</p>
      </div>
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default ModalProfileSection;
