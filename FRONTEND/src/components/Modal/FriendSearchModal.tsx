import React from "react";
import Modal from "./Modal";
import { useFriendSearchStore } from "../../store/friends/useFrendsSearchStore";
import { useFriendSearch } from "../../hooks/friends/usrFriendSearch";

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  const { searchTerm, setSearchTerm } = useFriendSearchStore();
  const { data: friends = [], handleSearch } = useFriendSearch(searchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm); // Zustand 상태 업데이트
    handleSearch(newTerm); // React Query 트리거
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">친구 검색</h2>
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="border mb-2 border-gray-300 rounded-full w-full py-2 pl-12 pr-8"
          placeholder="친구 검색"
        />
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
      <ul className="divide-y divide-gray-300 text-gray-900">
        {friends.map((friend, index) => (
          <li key={index} className="py-2 flex items-center mt-1 mb-1">
            <img
              src={friend.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 ml-8"
            />
            <div className="flex flex-col">
              <span className="font-bold">{friend.nickname}</span>
              <span className="text-gray-600 ml-2">{friend.bio}</span>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default FriendSearchModal;
