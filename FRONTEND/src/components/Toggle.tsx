import React from 'react';

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean; // 상태를 외부에서 전달받음
  onToggle: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ id, label, checked, onToggle }) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.target.checked); // 상태 변경 이벤트 실행
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
          checked={checked} // 외부 상태 반영
          onChange={handleOnChange} // 이벤트 핸들러
        />
        <div
          className={`${sizeClasses.backgroundSize} rounded-full transition-colors duration-300 ${
            checked ? 'bg-sky-300' : 'bg-gray-300'
          }`}
        >
          <div
            className={`${sizeClasses.dotSize} absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-300 ${
              checked ? sizeClasses.translateSize : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>
    </label>
  );
};

export default Toggle;
