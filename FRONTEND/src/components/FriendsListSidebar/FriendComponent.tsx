// 사이드바에 뜨는 친구 컴포넌트 입니다.
// 이 컴포넌트는 친구의 프로필 사진과, 친구의 이름, 진행여부(초록색점) 등으로 구성됩니다.

import React from "react";

function FriendComponent({ name, profilePic, status }) {
  return (
    <div className="friend-component">
      <img src={profilePic} alt="profile" />
      <h3>{name}</h3>
      <p>{status}</p>
    </div>
  );
}

export default FriendComponent;
