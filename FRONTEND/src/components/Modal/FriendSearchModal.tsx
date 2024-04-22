import React, { useState } from 'react';
import Modal from './Modal';

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
        <li className="py-2">123456789@gmail.com</li>
        <li className="py-2">123456789@gmail.com</li>
        <li className="py-2">123456789@gmail.com</li>
        <li className="py-2">123456789@gmail.com</li>
      </ul>
    </Modal>
  );
};

export default FriendSearchModal;
