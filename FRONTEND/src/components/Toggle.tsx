import React, { useState } from 'react';

interface ToggleProps {
  id: string;
  label: string;
  onToggle: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ id, label, onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onToggle(e.target.checked);
  };

  const sizeClasses = {
    backgroundSize: 'w-8 h-4', 
    dotSize: 'w-3 h-3',
    translateSize: 'translate-x-4', 
  };

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium text-gray-900">{label}</span>
      <div className="relative ml-20">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleOnChange}
        />
        <div className={`${sizeClasses.backgroundSize} rounded-full transition-colors duration-300 ${
          isChecked ? 'bg-sky-300' : 'bg-gray-300'
        }`}></div>
        <div
          className={`${sizeClasses.dotSize} absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-300 ${
            isChecked ? sizeClasses.translateSize : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Toggle;
