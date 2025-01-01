import React, { useCallback } from "react";
import { debounce } from "lodash";
import Modal from "./Modal";
import { useStore } from "@/store";
import { Friend } from "@/store";
// FriendSearchModal 컴포넌트의 props 인터페이스
interface FriendSearchModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

// 친구 검색 모달 컴포넌트
const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  // Zustand에서 상태 및 메서드 가져오기
  const memberId = useStore((state) => state.memberId);

  const { searchTerm, friends, setSearchTerm, setFriends } = useStore((state) => ({
    searchTerm: state.searchTerm, // 검색어
    friends: state.friends, // 검색 결과 친구 리스트
    setSearchTerm: state.setSearchTerm, // 검색어 업데이트 메서드
    setFriends: state.setFriends, // 친구 리스트 업데이트 메서드
  }));

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setFriends([]); // 검색어가 비어 있는 경우 친구 리스트 초기화
        return;
      }

      try {
        // API 호출로 친구 검색
        const response = await fetch(
          `http://siiso.site:8080/api/v1/members/search?nickNameOrEmail=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // 오류 처리
        }
        const data = await response.json();
        console.log("API 응답 데이터:", data); // 응답 전체 출력

        // targetMemberId 확인
        const mappedFriends = data.map((friend: any) => {
          console.log("친구 ㄱ데이터:", friend); // 각 friend 객체 확인
          console.log("userId:", friend.userId); // targetMemberId 확인

          return {
            id: friend.userId,
            profilePicture: friend.memberPhoto || "https://via.placeholder.com/100",
            nickname: friend.name,
            bio: friend.introduce,
          };
        });

        setFriends(mappedFriends); // 친구 리스트 업데이트

        console.log(mappedFriends);
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

  const handleFollow = async (friend: Friend) => {
    console.log(friend.nickname);
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://siiso.site:8080/api/v1/follows/${memberId}/following/${friend.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "이미 팔로우하고 있습니다.") {
          alert("이미 팔로우한 사용자입니다.");
        } else {
          throw new Error(`Error: ${response.status}`); //
        }
      }

      // 성공 시 상태를 업데이트하거나 UI에 반영
      console.log(`팔로우 성공:,${friend.nickname}`);
      alert(`${friend.nickname}님을 팔로우했습니다!`);
    } catch (error) {}
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
            <div className="flex  items-center ">
              <div className="flex  items-center">
                <img
                  src={friend.profilePicture} // 친구 프로필 이미지 URL
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-4 ml-4"
                />
                {/* 친구 정보 (닉네임, 소개글) */}
                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col max-x-[200px]">
                    <span className="font-bold truncate">
                      {friend.nickname.length > 8
                        ? friend.nickname.slice(0, 8) + "..."
                        : friend.nickname}
                    </span>

                    <span className="text-gray-600 truncate">
                      {friend.bio.length > 8 ? friend.bio.slice(0, 8) + "..." : friend.bio}
                    </span>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => {
                        console.log("팔로우 하려는 ID", friend.id);
                        handleFollow(friend);
                      }}
                      className="w-24 bg-purple-200 rounded-full px-4 py-2"
                    >
                      팔로우
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default FriendSearchModal;
