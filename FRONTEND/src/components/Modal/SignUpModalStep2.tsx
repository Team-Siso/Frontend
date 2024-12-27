import React from "react";
import Modal from "./Modal";
import Input from "../Input";
import { useSignUpStore } from "../../store/modals/useSignUpStore";

interface SignUpModalStep2Props {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModalStep2: React.FC<SignUpModalStep2Props> = ({ isOpen, onClose }) => {
  const { nickname, bio, profilePic, setNickname, setBio, handleProfilePicChange } = useSignUpStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 페이지 리로드 방지
    console.log("가입 완료");
    // 추가 로직 필요 시 이곳에 작성
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Step 2: 프로필 설정</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <img
            src={profilePic || "/default-profile.png"}
            alt="프로필 이미지"
            className="rounded-full w-24 h-24 mx-auto"
          />
          <input type="file" onChange={handleProfilePicChange} className="mt-2 mx-auto" />
        </div>

        <div className="mb-4">
          <label htmlFor="nickname">닉네임</label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bio">자기소개</label>
          <Input
            id="bio"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해주세요"
          />
        </div>

        <button
          type="submit"
          className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
        >
          가입 완료
        </button>
      </form>
    </Modal>
  );
};

export default SignUpModalStep2;
