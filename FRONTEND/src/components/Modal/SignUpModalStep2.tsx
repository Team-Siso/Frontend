import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Input from '../Input';
import profileImage from '../../assets/profile.png';
import cameraIcon from '../../assets/camera.png';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface SignUpModalStep2Props {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModalStep2: React.FC<SignUpModalStep2Props> = ({ isOpen, onClose }) => {
  const nickname = useAuthStore((state) => state.nickname);
  const setNickname = useAuthStore((state) => state.setNickname);
  const bio = useAuthStore((state) => state.bio);
  const setBio = useAuthStore((state) => state.setBio);
  const profilePic = useAuthStore((state) => state.profilePic);
  const signUpFunc = useAuthStore((state) => state.signUp);
  const uploadImageFunc = useAuthStore((state) => state.uploadImage);
  const [file, setFile] = React.useState<File | null>(null);
  const navigate = useNavigate();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        useAuthStore.getState().setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // store에서 email, password, confirmPassword, nickname, bio 등이 이미 저장되어 있음
      const memberId = await signUpFunc(); // 회원가입 API 호출 (payload는 store 내부에서 구성)
      if (file) {
        await uploadImageFunc(file, memberId); // 프로필 이미지 업로드
      }
      onClose();
      navigate('/main');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>

      <div className="relative flex flex-col items-center mb-4">
        <img src={profilePic || profileImage} alt="Profile" className="rounded-full w-24 h-24" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="profile-pic-input"
          onChange={handleProfilePicChange}
        />
        <img
          src={cameraIcon}
          alt="Edit profile"
          className="absolute bottom-4 right-21 w-10 h-10 cursor-pointer"
          style={{ transform: "translate(50%, 50%)" }}
          onClick={() => document.getElementById("profile-pic-input")?.click()}
        />
      </div>

      <div className="flex items-center mb-4">
        <Input
          id="nickname"
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="flex items-center mb-6">
        <Input
          id="bio"
          type="text"
          placeholder="자기소개를 입력하세요"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleSubmit}
      >
        확인
      </button>
    </Modal>
  );
};

export default SignUpModalStep2;
