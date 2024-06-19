import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useStore } from '../../store';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const memberId = useStore((state) => state.memberId);
  const memberProfile = useStore((state) => state.memberProfile);
  const updateNickname = useStore((state) => state.updateNickname);
  const updateIntroduce = useStore((state) => state.updateIntroduce);
  const updateProfilePicture = useStore((state) => state.updateProfilePicture);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);

  useEffect(() => {
    if (memberProfile) {
      setNickname(memberProfile.nickName);
      setEmail(memberProfile.email);
      setBio(memberProfile.introduce);
    }
  }, [memberProfile]);

  const handleSave = async () => {
    try {
      if (memberId) {
        await updateNickname(memberId, nickname);
        await updateIntroduce(memberId, bio);
        if (profilePic) {
          await updateProfilePicture(memberId, profilePic);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
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
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile"
                className="rounded-full w-30 h-30"
              />
            ) : (
              <img
                src={memberProfile?.profileUrl || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="rounded-full w-30 h-30"
              />
            )}
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
            disabled
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
