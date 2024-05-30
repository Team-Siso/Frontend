import React from 'react';
import Modal from './Modal';
import { useStore } from '../../store';

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  const { searchTerm, friends, setSearchTerm, setFriends } = useStore((state) => ({
    searchTerm: state.searchTerm,
    friends: state.friends,
    setSearchTerm: state.setSearchTerm,
    setFriends: state.setFriends,
  }));

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (!query.trim()) {
      setFriends([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/members/search?nickNameOrEmail=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setFriends(data.map((friend: any) => ({
        profilePicture: friend.memberPhoto || 'default-profile-pic-url', // 기본 프로필 이미지 URL 사용
        nickname: friend.name,
        bio: friend.introduce, // 소개글 사용
      })));
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="border mb-2 border-gray-300 rounded-full w-full py-2 pl-12 pr-8"
          placeholder="친구 검색"
        />
        <svg className="w-6 h-6 absolute left-4 top-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 19l-3.5-3.5"></path>
          <circle cx="11" cy="11" r="6"></circle>
        </svg>
      </div>
      <ul className="divide-y divide-gray-300 text-gray-900">
        {friends.map((friend, index) => (
          <li key={index} className="py-2 flex items-center mt-1 mb-1">
            <img src={friend.profilePicture} alt="Profile" className="w-12 h-12 rounded-full mr-4 ml-8" />
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
