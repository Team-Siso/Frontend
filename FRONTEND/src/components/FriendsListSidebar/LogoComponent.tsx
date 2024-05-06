// 친구 목록 사이드 바 맨 위에 나타나는 우리의 로고 컴포넌트 입니다.

// import React from "react";
import LogoImage from "../../assets/LogoImage.svg";

const LogoComponent = () => (
  <div className="flex justify-center mt-4 mb-4">
    {" "}
    {/* 로고 이미지를 중앙 정렬하고 위에 마진을 1rem 추가 */}
    <img src={LogoImage} alt="Logo" className="block" />
  </div>
);

export default LogoComponent;
