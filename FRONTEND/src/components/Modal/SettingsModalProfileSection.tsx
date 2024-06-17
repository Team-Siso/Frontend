import React, { useEffect } from 'react';
import profileImage from '../../assets/profile.png';
import penIcon from '../../assets/pen.png';
import EditProfileModal from './EditProfileModal';
import { useStore } from '../../store';

const ModalProfileSection: React.FC = () => {
  const isEditModalOpen = useStore((state) => state.isEditModalOpen);
  const setEditModalOpen = useStore((state) => state.setEditModalOpen);
  const memberProfile = useStore((state) => state.memberProfile);
  const fetchMemberProfile = useStore((state) => state.fetchMemberProfile);
  const memberId = useStore((state) => state.memberId);

  useEffect(() => {
    if (memberId) {
      console.log('Calling fetchMemberProfile with memberId:', memberId); // 로그 추가
      fetchMemberProfile(memberId);
    }
  }, [memberId, fetchMemberProfile]);

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  if (!memberProfile) {
    return null; // memberProfile이 없는 경우 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex items-center mb-6 text-left">
      <img src={memberProfile.profileUrl || profileImage} alt="Profile" className="rounded-full w-20 h-20 mr-5" />
      <div className="mr-10">
        <div className="flex items-center">
          <p className="text-lg font-bold mr-2">{memberProfile.nickName}</p>
          <img src={penIcon} alt="Edit" className="w-4 h-4 cursor-pointer" onClick={openEditModal} />
        </div>
        <p className="text-sm text-gray-600">{memberProfile.email}</p>
        <p className="text-sm text-gray-500">{memberProfile.introduce}</p>
      </div>
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default ModalProfileSection;
