// 친구 목록 사이드 바 맨 위에 나타나는 우리의 로고 컴포넌트 입니다.

import React from "react";
import LogoImage from "../../assets/LogoImage.svg";

const LogoComponent = () => (
  <div>
    <img src={LogoImage} alt="Logo" />
  </div>
);

export default LogoComponent;
