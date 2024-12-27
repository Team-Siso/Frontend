import React from "react";
import Modal from "./Modal";
import Toggle from "../Toggle";
import ProfileSection from "./SettingsModalProfileSection";
import { useToggleSetting } from "../../hooks/settings/useToggleSetting";
import { useSettingsStore } from "../../store/settings/useSettingsStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    fixedNotifications,
    friendAddNotifications,
    setFixedNotifications,
    setFriendAddNotifications,
  } = useSettingsStore();

  const toggleMutation = useToggleSetting();

  const handleToggleChange = (value: boolean, setting: string) => {
    toggleMutation.mutate({ setting, value });

    // Zustand 상태 업데이트
    if (setting === "Fixed notifications") setFixedNotifications(value);
    if (setting === "Friend add notifications") setFriendAddNotifications(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <ProfileSection />

        <div className="w-4/5">
          <hr className="mb-4" />

          {/* 고정 루틴 알림 토글 */}
          <div className="flex justify-center">
            <Toggle
              id="fixed-notification-toggle"
              label="고정 루틴 알림"
              checked={fixedNotifications} // Zustand 상태 사용
              onToggle={(value) => handleToggleChange(value, "Fixed notifications")}
            />
          </div>
          <hr className="my-3" />

          {/* 친구 추가 알림 토글 */}
          <div className="flex justify-center">
            <Toggle
              id="friend-add-notification-toggle"
              label="친구 추가 알림"
              checked={friendAddNotifications} // Zustand 상태 사용
              onToggle={(value) => handleToggleChange(value, "Friend add notifications")}
            />
          </div>
          <hr className="my-3" />
        </div>

        <button
          type="button"
          className="mt-3 w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        >
          로그아웃
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;