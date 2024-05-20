import React, { useState } from 'react';
import Modal from './Modal';

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Friend {
  userId: number;
  profilePicture: string;
  nickname: string;
  email: string;
  introduce: string;
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value.trim() === '') {
      setFriends([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/members/search?query=${encodeURIComponent(event.target.value)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);  // 데이터 로그

      if (!Array.isArray(data)) {
        throw new Error('Unexpected response data format');
      }

      const formattedData = data.map((friend: any) => ({
        userId: friend.userId,
        profilePicture: friend.memberPhoto,
        nickname: friend.name,
        email: friend.email, // Assuming the response includes an email field
        introduce: friend.introduce,
      }));
      setFriends(formattedData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
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
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ul className="divide-y divide-gray-300 text-gray-900">
          {friends.map((friend) => (
            <li key={friend.userId} className="py-2 flex items-center mt-1 mb-1">
              <img src={friend.profilePicture} alt="Profile" className="w-12 h-12 rounded-full mr-4 ml-8" />
              <div className="flex flex-col">
                <span className="font-bold">{friend.nickname}</span>
                <span className="text-gray-600 ml-2">{friend.email}</span>
                <span className="text-gray-500 ml-2">{friend.introduce}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default FriendSearchModal;
