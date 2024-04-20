import React from 'react';

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ id, type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      className="m-1 mb-4 border-b border-gray-300 focus:outline-none w-80 h-8"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        transition: 'box-shadow 0.3s',
        boxShadow: 'none'
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = '0 1px 0 0 currentColor')}
      onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
    />
  );
};

export default Input;
