import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GrayCircle from "../../assets/GrayCircle.svg";
import HomeButtonImage from "../../assets/HomeButtonImage.svg";
import SearchButtonImage from "../../assets/SearchButtonImage.svg";
import SettingButtonImage from "../../assets/SettingButtonImage.svg";
import KebabMenuButtonImage from "../../assets/KebabMenuButtonImage.svg";

const MenuComponent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/friend-search', { state: { from: window.location.pathname } });
  };

  const handleHomeClick = () => {
    navigate('/main');
  };

  const handleSettingsClick = () => {
    navigate('/settings', { state: { from: window.location.pathname } });
  };

  return (
    <div
      className="relative w-20 h-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={KebabMenuButtonImage}
        alt="Menu"
        className="absolute left-[-7px] bottom-1 w-11 h-11"
      />
      {isHovered && (
        <div className="absolute w-20 h-20 top-0 left-0">
          <img
            src={GrayCircle}
            alt="GrayCircle"
            className="w-full h-auto transform scale-125 translate-x-[1px] translate-y-[-16px]" // 이미지 확대
          />
          <div className="absolute w-9 h-9 top-[-15px] left-[-2px]">
            <img
              src={SearchButtonImage}
              alt="Search"
              className="w-full h-full cursor-pointer"
              onClick={handleSearchClick}
            />
          </div>
          <div className="absolute w-9 h-9 top-[-2px] right-2">
            <img
              src={HomeButtonImage}
              alt="Home"
              className="w-full h-full cursor-pointer"
              onClick={handleHomeClick}
            />
          </div>
          <div className="absolute w-9 h-9 bottom-2 right-[-3px]">
            <img
              src={SettingButtonImage}
              alt="Settings"
              className="w-full h-full cursor-pointer"
              onClick={handleSettingsClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuComponent;
