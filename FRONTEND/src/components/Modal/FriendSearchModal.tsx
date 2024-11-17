import React, { useCallback } from "react";
import { debounce } from "lodash";
import Modal from "./Modal";
import { useStore } from "../../store";

// FriendSearchModal 컴포넌트의 props 인터페이스
interface FriendSearchModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 친구 검색 모달 컴포넌트
const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  // Zustand에서 상태 및 메서드 가져오기
  const { searchTerm, friends, setSearchTerm, setFriends } = useStore((state) => ({
    searchTerm: state.searchTerm, // 검색어
    friends: state.friends, // 검색 결과 친구 리스트
    setSearchTerm: state.setSearchTerm, // 검색어 업데이트 메서드
    setFriends: state.setFriends, // 친구 리스트 업데이트 메서드
  }));

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        // 검색어가 비어 있는 경우
        setFriends([]); // 친구 리스트 초기화
        return;
      }

      try {
        // API 호출로 친구 검색
        const response = await fetch(
          `http://localhost:8080/api/v1/members/search?nickNameOrEmail=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // 오류 처리
        }
        const data = await response.json();
        // 검색 결과 업데이트 (프로필 사진, 닉네임, 소개글 포함)
        setFriends(
          data.map((friend: any) => ({
            profilePicture: friend.memberPhoto || "https://via.placeholder.com/100", // 기본 프로필 이미지 URL 사용
            nickname: friend.name,
            bio: friend.introduce,
          }))
        );
      } catch (error) {
        console.error("Error fetching friends:", error); // 오류 로그 출력
      }
    }, 500),
    [setFriends]
  );
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // 검색어
    setSearchTerm(query); // Zustand의 검색어 상태 업데이트
    debouncedSearch(query);
  };
  return (
    // 모달 컴포넌트 사용
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">친구 검색</h2>
      {/* 검색 입력 필드 */}
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm} // Zustand 검색어 상태 바인딩
          onChange={handleSearch} // 검색어 입력 시 이벤트 처리
          className="border mb-2 border-gray-300 rounded-full w-full py-2 pl-12 pr-8"
          placeholder="친구 검색" // 입력 필드 플레이스홀더
        />
        {/* 돋보기 아이콘 */}
        <svg
          className="w-6 h-6 absolute left-4 top-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 19l-3.5-3.5"></path>
          <circle cx="11" cy="11" r="6"></circle>
        </svg>
      </div>
      {/* 친구 리스트 */}
      <ul className="divide-y divide-gray-300 text-gray-900">
        {friends.map((friend, index) => (
          <li key={index} className="py-2 flex items-center mt-1 mb-1">
            {/* 친구 프로필 이미지 */}
            <img
              src={friend.profilePicture} // 친구 프로필 이미지 URL
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 ml-8"
            />
            {/* 친구 정보 (닉네임, 소개글) */}
            <div className="flex flex-col">
              <span className="font-bold">{friend.nickname}</span> {/* 닉네임 */}
              <span className="text-gray-600 ml-2">{friend.bio}</span> {/* 소개글 */}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default FriendSearchModal;
