import React from 'react';

interface ConfirmButtonProps {
  onClick: () => void;
  text: string;  // 버튼 텍스트를 위한 prop 추가
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick, text }) => {
  return (
    <button 
      className="absolute right-5 bottom-5 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded inline-flex items-center border-2 border-gray-400 focus:outline-none focus:shadow-outline"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ConfirmButton;
