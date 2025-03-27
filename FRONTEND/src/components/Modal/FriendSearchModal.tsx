import React from "react";
import Modal from "./Modal";
import { useFriendSearchStore } from "@/store/friends/useFriendSearchStore";
import { useFriendSearch } from "@/hooks/friend/useFriendSearch";
import { followFriend } from "@/api/friend";
import { Friend } from "@/api/friend";
import { useMemberStore } from "@/store/member/useMemberStore";

interface FriendSearchModalProps {
  isOpen: boolean;    // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  const { memberId } = useMemberStore();

  const {
    searchTerm,
    friends,
    setSearchTerm,
  } = useFriendSearchStore();

  const { isLoading, error } = useFriendSearch(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFollow = async (friend: Friend) => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await followFriend(memberId, friend.id);
      alert(`${friend.nickname}님을 팔로우했습니다!`);
    } catch (err: any) {
      if (err.message === "이미 팔로우한 사용자입니다.") {
        alert(err.message);
      } else {
        console.error("팔로우 에러:", err);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">친구 검색</h2>

      {/* 검색창 */}
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border mb-2 border-gray-300 rounded-full w-full py-2 pl-12 pr-8"
          placeholder="닉네임 혹은 이메일 검색"
        />
        <svg
          className="w-6 h-6 absolute left-4 top-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 19l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 로딩/에러 상태 표시 (선택사항) */}
      {isLoading && <p>검색 중...</p>}
      {error && <p className="text-red-500">에러 발생: {error.message}</p>}

      {/* 검색 결과 목록 */}
      <ul className="divide-y divide-gray-300 text-gray-900">
        {friends.map((friend) => (
          <li key={friend.id} className="py-2 flex items-center mt-1 mb-1">
            <div className="flex items-center">
              <img
                src={friend.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 ml-4"
              />
              <div className="flex flex-row space-x-4">
                <div className="flex flex-col max-x-[200px]">
                  <span className="font-bold truncate">
                    {friend.nickname.length > 8
                      ? friend.nickname.slice(0, 8) + "..."
                      : friend.nickname}
                  </span>
                  <span className="text-gray-600 truncate">
                    {friend.bio.length > 8
                      ? friend.bio.slice(0, 8) + "..."
                      : friend.bio}
                  </span>
                </div>
                <button
                  onClick={() => handleFollow(friend)}
                  className="w-24 bg-purple-200 rounded-full px-4 py-2"
                >
                  팔로우
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default FriendSearchModal;
