import React, { useEffect } from 'react';
import profileImage from '../../assets/profile.png'; // 기본 프로필 이미지
import penIcon from '../../assets/pen.png'; // 편집 아이콘
import EditProfileModal from './EditProfileModal'; // 프로필 수정 모달 컴포넌트
import { useStore } from '../../store';

// ModalProfileSection 컴포넌트 정의
const ModalProfileSection: React.FC = () => {
  // Zustand에서 상태 및 메서드 가져오기
  const isEditModalOpen = useStore((state) => state.isEditModalOpen); // 프로필 수정 모달 열림 여부
  const setEditModalOpen = useStore((state) => state.setEditModalOpen); // 모달 상태 변경 메서드
  const memberProfile = useStore((state) => state.memberProfile); // 멤버 프로필 정보

  const fetchMemberProfile = useStore((state) => state.fetchMemberProfile); // 멤버 프로필을 가져오는 메서드
  const memberId = useStore((state) => state.memberId); // 현재 멤버 ID

  // 컴포넌트가 렌더링될 때 멤버 프로필 데이터를 가져옴
  useEffect(() => {
    if (memberId) {
      console.log('Calling fetchMemberProfile with memberId:', memberId); // 디버깅 로그
      fetchMemberProfile(memberId); // 멤버 프로필 가져오기
    }
  }, [memberId, fetchMemberProfile]);

  // 프로필 수정 모달 열기
  const openEditModal = () => {
    setEditModalOpen(true);
  };

  // 프로필 수정 모달 닫기
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  // memberProfile이 없는 경우 아무것도 렌더링하지 않음
  if (!memberProfile) {
    return null;
  }

  return (
    <div className="flex items-center mb-6 text-left">
      {/* 프로필 이미지 */}
      <img
        src={memberProfile.profileUrl || profileImage} // 프로필 이미지 URL 또는 기본 이미지 사용
        alt="Profile"
        className="rounded-full w-20 h-20 mr-5" // 이미지 스타일
      />
      {/* 프로필 정보 */}
      <div className="mr-10">
        <div className="flex items-center">
          <p className="text-lg font-bold mr-2">{memberProfile.nickName}</p> {/* 닉네임 */}
          <img
            src={penIcon} // 편집 아이콘
            alt="Edit"
            className="w-4 h-4 cursor-pointer" // 아이콘 스타일
            onClick={openEditModal} // 클릭 시 프로필 수정 모달 열기
          />
        </div>
        <p className="text-sm text-gray-600">{memberProfile.email}</p> {/* 이메일 */}
        <p className="text-sm text-gray-500">{memberProfile.introduce}</p> {/* 자기소개 */}
      </div>
      {/* 프로필 수정 모달 */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default ModalProfileSection;