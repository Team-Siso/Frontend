// 리스트 사이드바에서 나의 프로필 부분을 담당하는 컴포넌트 입니다.
// import React from "react";
import { useState, useEffect } from "react";
import FriendsProfileEx from "@/assets/FriendsProfileEx.svg";
import { useStore } from "@/store";

const MyProfileComponent = ({ className }) => {
  const memberId = useStore((state) => state.memberId);
  const [profile, setProfile] = useState({
    nickname: "",
    introduce: "",
    memberPhoto: FriendsProfileEx,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (memberId) {
        try {
          const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}`, {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfile({
              nickname: data.nickname || "",
              introduce: data.introduce || "",
              memberPhoto: data.memberPhoto || FriendsProfileEx,
            });
          } else {
            console.error("프로필 불러오기 실패:", response.status);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchProfile();
  }, [memberId]);

  return (
    <div className={`flex items-center pl-sd7 pr-7 pt-3 font-sans text-lg ${className}`}>
      <img src={profile.memberPhoto} alt="프로필" className="rounded-full ml-4 mr-4 w-20 h-20" />
      <div>
        <div className="font-bold text-xl text-black">{profile.nickname}</div>
        <div className="text-sm text-gray-700">{profile.introduce}</div>
      </div>
    </div>
  );
};

export default MyProfileComponent;
