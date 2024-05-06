// 리스트 사이드바에서 나의 프로필 부분을 담당하는 컴포넌트 입니다.
// import React from "react";
import FriendsProfileEx from "../../assets/FriendsProfileEx.svg";

const MyProfileComponent = ({ className }) => (
  <div className={`flex items-center pl-7 pr-7 pt-3 font-sans  text-lg ${className}`}>
    <img src={FriendsProfileEx} alt="프로필" className="rounded-full mr-4 w-20 h-20" />
    <div>
      <div className="font-bold text-xl text-black">초이언니</div>
      <div className="text-sm text-gray-700">나는 잘나가는 프론트엔드 개발자입니다?</div>
    </div>
  </div>
);
export default MyProfileComponent;
