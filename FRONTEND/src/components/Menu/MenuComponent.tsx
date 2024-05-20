// MenuComponent는
// 친구 리스트 사이드 바 하단에 있는
import React, { useState } from "react";
import GrayCircle from "../../assets/GrayCircle.svg";
import HomeButtonImage from "../../assets/HomeButtonImage.svg";
import SearchButtonImage from "../../assets/SearchButtonImage.svg";
import SettingButtonImage from "../../assets/SettingButtonImage.svg";
import KebabMenuButtonImage from "../../assets/KebabMenuButtonImage.svg";

const MenuComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-20 h-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={KebabMenuButtonImage} alt="Menu" className="absolute left-3 top-3 w-6 h-6" />

      {isHovered && (
        <div className="absolute w-20 h-20 top-0 left-0">
          <div className="w-full h-full rounded-full bg-gray-200">
            <div className="absolute w-8 h-8 top-1 left-1">
              <img src={SearchButtonImage} alt="Search" className="w-full h-full" />
            </div>
            <div className="absolute w-8 h-8 top-1 right-1">
              <img src={HomeButtonImage} alt="Home" className="w-full h-full" />
            </div>
            <div className="absolute w-8 h-8 bottom-1 right-1">
              <img src={SettingButtonImage} alt="Settings" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuComponent;
