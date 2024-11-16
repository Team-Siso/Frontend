import React from 'react';
import Modal from './Modal';
import Toggle from '../Toggle';
import ProfileSection from './SettingsModalProfileSection';

// SettingsModal 컴포넌트의 props 인터페이스 정의
interface SettingsModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 설정 모달 컴포넌트
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // 토글 상태 변경 핸들러
  const handleToggleChange = (value: boolean, setting: string) => {
    console.log(`${setting} is now ${value ? 'enabled' : 'disabled'}.`); // 토글 상태 로그 출력
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* 모달 콘텐츠 */}
      <div className="flex flex-col items-center">
        {/* 프로필 섹션 */}
        <ProfileSection />

        {/* 알림 설정 섹션 */}
        <div className="w-4/5">
          <hr className="mb-4" /> {/* 섹션 구분선 */}

          {/* 고정 루틴 알림 토글 */}
          <div className="flex justify-center">
            <Toggle
              id="fixed-notification-toggle"
              label="고정 루틴 알림" // 토글 라벨
              onToggle={(value) => handleToggleChange(value, 'Fixed notifications')} // 토글 변경 핸들러
            />
          </div>
          <hr className="my-3" /> {/* 섹션 구분선 */}
          
          {/* 친구 추가 알림 토글 */}
          <div className="flex justify-center">
            <Toggle
              id="friend-add-notification-toggle"
              label="친구 추가 알림" // 토글 라벨
              onToggle={(value) => handleToggleChange(value, 'Friend add notifications')} // 토글 변경 핸들러
            />
          </div>
          <hr className="my-3" /> {/* 섹션 구분선 */}
        </div>

        {/* 로그아웃 버튼 */}
        <button
          type="submit"
          className="mt-3 w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        >
          로그아웃
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;