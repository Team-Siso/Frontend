import React, { useState } from "react";
import profileImage from "../../assets/profile.png";
import penIcon from "../../assets/pen.png";
import EditProfileModal from "./EditProfileModal";
import { useMemberProfile } from "../../hooks/member/useMemberProfile";

// ModalProfileSection 컴포넌트 정의
const ModalProfileSection: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const memberId = "12345"; // 예제 멤버 ID (Context나 Props로 전달될 수 있음)

  // React Query 훅 사용
  const { data: memberProfile, isLoading, isError, refetch } = useMemberProfile(memberId);

  // 로딩 상태 처리
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load profile. Please try again later.</div>;

  // 프로필 수정 모달 열기 및 닫기 핸들러
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => {
    setEditModalOpen(false);
    refetch(); // 데이터 리패칭
  };

  // memberProfile이 없는 경우
  if (!memberProfile) return null;

  return (
    <div className="flex items-center mb-6 text-left">
      {/* 프로필 이미지 */}
      <img
        src={memberProfile.profileUrl || profileImage}
        alt="Profile"
        className="rounded-full w-20 h-20 mr-5"
      />
      {/* 프로필 정보 */}
      <div className="mr-10">
        <div className="flex items-center">
          <p className="text-lg font-bold mr-2">{memberProfile.nickName}</p>
          <img
            src={penIcon}
            alt="Edit"
            className="w-4 h-4 cursor-pointer"
            onClick={openEditModal}
          />
        </div>
        <p className="text-sm text-gray-600">{memberProfile.email}</p>
        <p className="text-sm text-gray-500">{memberProfile.introduce}</p>
      </div>
      {/* 프로필 수정 모달 */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default ModalProfileSection;