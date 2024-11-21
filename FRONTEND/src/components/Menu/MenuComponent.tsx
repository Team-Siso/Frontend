import React from "react";
import GrayCircle from "@/assets/GrayCircle.svg";
import HomeButtonImage from "@/assets/HomeButtonImage.svg";
import SearchButtonImage from "@/assets/SearchButtonImage.svg";
import SettingButtonImage from "@/assets/SettingButtonImage.svg";
import KebabMenuButtonImage from "@/assets/KebabMenuButtonImage.svg";

interface MenuComponentProps {
  openFriendSearchModal: () => void; // 친구 검색 모달 열기 핸들러
  openSettingsModal: () => void; // 설정 모달 열기 핸들러
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  openFriendSearchModal,
  openSettingsModal,
}) => {
  return (
    <div className="relative w-20 h-20">
      <img
        src={KebabMenuButtonImage}
        alt="Menu"
        className="absolute left-[-7px] bottom-1 w-11 h-11"
      />
      <div className="absolute w-20 h-20 top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
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
            onClick={openFriendSearchModal} // 친구 검색 모달 열기
          />
        </div>
        <div className="absolute w-9 h-9 top-[-2px] right-2">
          <img
            src={HomeButtonImage}
            alt="Home"
            className="w-full h-full cursor-pointer"
            onClick={() => (window.location.href = "/main")} // 메인으로 이동
          />
        </div>
        <div className="absolute w-9 h-9 bottom-2 right-[-3px]">
          <img
            src={SettingButtonImage}
            alt="Settings"
            className="w-full h-full cursor-pointer"
            onClick={openSettingsModal} // 설정 모달 열기
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MenuComponent);
