// 친구 목록 사이드바에 있는 다음 친구를 볼 수 있도록 하는 버튼 입니다.
import React from "react";
import NextPageImage from "../../assets/NextPageImage.svg";

const NextPageComponent = () => (
  <div className="flex justify-center mt-4 mb-4">
    {" "}
    {/* 로고 이미지를 중앙 정렬하고 위에 마진을 1rem 추가 */}
    <img src={NextPageImage} alt="NextPageImage" className="block" />
  </div>
);

export default NextPageComponent;
