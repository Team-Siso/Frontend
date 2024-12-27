export interface Friend {
    profilePicture: string;
    nickname: string;
    bio: string;
  }
  
  // 친구 검색 API 호출 함수
  export const fetchFriends = async (searchTerm: string): Promise<Friend[]> => {
    if (!searchTerm.trim()) return []; // 검색어가 비어 있으면 빈 배열 반환
  
    const response = await fetch(
      `http://43.203.231.200:8080/api/v1/members/search?nickNameOrEmail=${encodeURIComponent(searchTerm)}`
    );
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`); // 오류 처리
    }
  
    const data = await response.json();
    return data.map((friend: any) => ({
      profilePicture: friend.memberPhoto || "https://via.placeholder.com/100", // 기본 프로필 이미지 URL
      nickname: friend.name,
      bio: friend.introduce,
    }));
  };
  