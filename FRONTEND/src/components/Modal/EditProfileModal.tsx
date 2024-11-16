import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useStore } from '../../store';

// EditProfileModal 컴포넌트의 props 인터페이스
interface EditProfileModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// EditProfileModal 컴포넌트: 사용자 프로필 수정 UI 제공
const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  // Zustand에서 상태와 메서드 가져오기
  const memberId = useStore((state) => state.memberId);
  const memberProfile = useStore((state) => state.memberProfile);
  const updateNickname = useStore((state) => state.updateNickname);
  const updateIntroduce = useStore((state) => state.updateIntroduce);
  const updateProfilePicture = useStore((state) => state.updateProfilePicture);

  // 컴포넌트 내부 상태
  const [nickname, setNickname] = useState(''); // 닉네임
  const [email, setEmail] = useState(''); // 이메일
  const [bio, setBio] = useState(''); // 자기소개
  const [profilePic, setProfilePic] = useState<File | null>(null); // 프로필 사진

  // memberProfile이 변경될 때 내부 상태 초기화
  useEffect(() => {
    if (memberProfile) {
      setNickname(memberProfile.nickName); // 닉네임 설정
      setEmail(memberProfile.email); // 이메일 설정
      setBio(memberProfile.introduce); // 자기소개 설정
    }
  }, [memberProfile]);

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    try {
      if (memberId) {
        // 닉네임, 자기소개 업데이트
        await updateNickname(memberId, nickname);
        await updateIntroduce(memberId, bio);

        // 프로필 사진 업데이트
        if (profilePic) {
          await updateProfilePicture(memberId, profilePic);
        }

        // 수정 완료 후 모달 닫기
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error); // 오류 로그
      alert('프로필 수정 중 오류가 발생했습니다.'); // 오류 알림
    }
  };

  // 프로필 사진 변경 핸들러
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]); // 파일 상태 업데이트
    }
  };

  // 파일 입력 필드 열기
  const openFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 w-128">
        {/* 모달 헤더 */}
        <h2 className="text-xl font-bold mb-4 text-center">프로필 수정</h2>
        
        {/* 프로필 사진 */}
        <div className="mb-4 flex justify-center items-center relative">
          <div className="relative cursor-pointer" onClick={openFileInput}>
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)} // 선택한 파일 미리보기
                alt="Profile"
                className="rounded-full w-30 h-30"
              />
            ) : (
              <img
                src={memberProfile?.profileUrl || 'https://via.placeholder.com/100'} // 기존 프로필 사진 또는 기본 이미지
                alt="Profile"
                className="rounded-full w-30 h-30"
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="file-input"
              className="hidden"
              onChange={handleProfilePicChange} // 파일 변경 핸들러
            />
          </div>
        </div>
        
        {/* 닉네임 입력 필드 */}
        <div className="mb-4">
          <label className="block text-gray-700">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 닉네임 업데이트
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* 이메일 입력 필드 (비활성화) */}
        <div className="mb-4">
          <label className="block text-gray-700">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 업데이트 (사용 불가)
            className="border rounded w-full py-2 px-3 text-gray-700"
            disabled
          />
        </div>

        {/* 자기소개 입력 필드 */}
        <div className="mb-4">
          <label className="block text-gray-700">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)} // 자기소개 업데이트
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-3 w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSave} // 저장 핸들러
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;