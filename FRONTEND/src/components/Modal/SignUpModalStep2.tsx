import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 React Router 훅
import Modal from './Modal';
import Input from '../Input';
import profileImage from '../../assets/profile.png'; // 기본 프로필 이미지
import cameraIcon from '../../assets/camera.png'; // 카메라 아이콘
import { useStore } from '../../store';

// SignUpModalStep2 컴포넌트의 props 인터페이스 정의
interface SignUpModalStep2Props {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 회원가입 2단계 모달 컴포넌트 정의
const SignUpModalStep2: React.FC<SignUpModalStep2Props> = ({ isOpen, onClose }) => {
  // Zustand에서 상태와 메서드 가져오기
  const nickname = useStore((state) => state.nickname); // 닉네임 상태
  const setNickname = useStore((state) => state.setNickname); // 닉네임 업데이트 메서드
  const bio = useStore((state) => state.bio); // 자기소개 상태
  const setBio = useStore((state) => state.setBio); // 자기소개 업데이트 메서드
  const profilePic = useStore((state) => state.profilePic); // 프로필 사진 상태
  const setProfilePic = useStore((state) => state.setProfilePic); // 프로필 사진 업데이트 메서드
  const signUp = useStore((state) => state.signUp); // 회원가입 메서드
  const uploadImage = useStore((state) => state.uploadImage); // 이미지 업로드 메서드

  const [file, setFile] = useState<File | null>(null); // 선택된 파일 상태
  const navigate = useNavigate(); // 페이지 이동 훅

  // 프로필 사진 변경 핸들러
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 업로드된 파일 가져오기
    if (file) {
      setFile(file); // 파일 상태 업데이트
      const reader = new FileReader(); // 파일을 Base64로 변환
      reader.onloadend = () => {
        setProfilePic(reader.result as string); // 상태에 Base64 URL 저장
      };
      reader.readAsDataURL(file); // 파일 읽기
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async () => {
    try {
      const memberId = await signUp(); // 회원가입 API 호출
      if (file) {
        const response = await uploadImage(file, memberId); // 프로필 이미지 업로드
        console.log('Image upload response:', response); // 업로드 응답 출력
      }
      onClose(); // 모달 닫기
      navigate('/main'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Error during signup:', error); // 오류 로그
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* 모달 헤더 */}
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>

      {/* 프로필 사진 선택 섹션 */}
      <div className="relative flex flex-col items-center mb-4">
        <img src={profilePic || profileImage} alt="Profile" className="rounded-full w-24 h-24" /> {/* 프로필 사진 */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="profile-pic-input" 
          onChange={handleProfilePicChange} // 파일 변경 핸들러
        />
        <img
          src={cameraIcon}
          alt="Edit profile"
          className="absolute bottom-4 right-21 w-10 h-10 cursor-pointer"
          style={{ transform: "translate(50%, 50%)" }} // 아이콘 위치
          onClick={() => document.getElementById("profile-pic-input")?.click()} // 클릭 시 파일 선택창 열기
        />
      </div>

      {/* 닉네임 입력 필드 */}
      <div className="flex items-center mb-4">
        <Input
          id="nickname"
          type="text"
          placeholder="닉네임" // 입력 필드 플레이스홀더
          value={nickname} // Zustand 닉네임 상태 바인딩
          onChange={(e) => setNickname(e.target.value)} // 닉네임 업데이트
        />
        <button
          style={{ marginTop: "-12px" }}
          className="w-16 h-8 bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded text-xs"
        >
          확인
        </button>
      </div>

      {/* 자기소개 입력 필드 */}
      <div className="flex items-center mb-6">
        <Input
          id="bio"
          type="text"
          placeholder="자기소개를 입력하세요" // 입력 필드 플레이스홀더
          value={bio} // Zustand 자기소개 상태 바인딩
          onChange={(e) => setBio(e.target.value)} // 자기소개 업데이트
        />
        <button
          style={{ marginTop: "-12px" }}
          className="w-16 h-8 bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded text-xs"
        >
          확인
        </button>
      </div>

      {/* 회원가입 제출 버튼 */}
      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleSubmit} // 제출 핸들러 호출
      >
        확인
      </button>
    </Modal>
  );
};

export default SignUpModalStep2;