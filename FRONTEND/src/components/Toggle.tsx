import React, { useState } from "react";

interface ToggleProps {
  id: string;
  label: string;
  onToggle: (checked: boolean) => void;
  marginClassName?: string;
  checkedBgClass?: string;
  uncheckedBgClass?: string;
  aText?: string;
  bText?: string;
  isChecked?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  onToggle,
  isChecked,
  marginClassName = "ml-20",
  checkedBgClass = "bg-sky-300",
  uncheckedBgClass = "bg-gray-300",
  aText = "Adsad",
  bText = "Bdasd",
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.target.checked);
  };

  const sizeClasses = {
    backgroundSize: "w-8 h-4",
    dotSize: "w-3 h-3",
    translateSize: "translate-x-4",
  };

  return (
    <label htmlFor={id} className="flex-cols items-center justify-center cursor-pointer">
      <span className="text-xs font-bold text-black">{isChecked ? aText : bText}</span>
      <span className=" text-sm font-medium text-gray-900">{label}</span>
      <div className={`relative ${marginClassName}`}>
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleOnChange}
        />
        <div
          className={`${sizeClasses.backgroundSize} rounded-full transition-colors duration-300 ${isChecked ? checkedBgClass : uncheckedBgClass}`}
        >
          <div
            className={`${sizeClasses.dotSize} absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-300 ${isChecked ? sizeClasses.translateSize : "translate-x-0"}`}
          ></div>
        </div>
      </div>
    </label>
  );
};

export default Toggle;
