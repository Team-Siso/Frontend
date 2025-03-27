import DefaultImage from "@/assets/profile.png";

export interface Friend {
  id: string;
  profilePicture: string;
  nickname: string;
  bio: string;
  isActive: boolean;
}

export const fetchFriends = async (query: string): Promise<Friend[]> => {
  if (!query.trim()) return [];

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/members/search?nickNameOrEmail=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();

  return data.map((friend: any) => {
    let pic = friend.memberPhoto;
    if (!pic || pic === "string") {
      pic = DefaultImage;
    }

    return {
      id: friend.userId,
      profilePicture: pic,
      nickname: friend.name,
      bio: friend.introduce,
      isActive: friend.isActive,
    };
  });
};

// 새로 추가: followFriend
export async function followFriend(memberId: number, friendId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/follows/${memberId}/following/${friendId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    // API 응답 바디 파싱
    const errorData = await response.json();
    if (errorData.message === "이미 팔로우하고 있습니다.") {
      // 이미 팔로우한 상태에 대한 에러 처리
      throw new Error("이미 팔로우한 사용자입니다.");
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  }
}
