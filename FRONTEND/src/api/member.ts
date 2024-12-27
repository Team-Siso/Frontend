import axios from "axios";

// 멤버 프로필 타입
export interface MemberProfile {
  nickName: string;
  email: string;
  introduce: string;
  profileUrl: string;
}

// 프로필 업데이트 요청 타입
export interface UpdateProfilePayload {
  memberId: string;
  nickname?: string;
  bio?: string;
  profilePic?: File | null;
}

// 멤버 프로필 가져오기
export const fetchMemberProfile = async (memberId: string): Promise<MemberProfile> => {
  const { data } = await axios.get(`http://43.203.231.200:8080/api/v1/members/${memberId}`);
  return data;
};

// 멤버 프로필 업데이트
export const updateMemberProfile = async (payload: UpdateProfilePayload): Promise<void> => {
  const formData = new FormData();
  if (payload.nickname) formData.append("nickname", payload.nickname);
  if (payload.bio) formData.append("introduce", payload.bio); // API 스펙에 맞게 key 수정
  if (payload.profilePic) formData.append("profilePic", payload.profilePic);

  await axios.post(
    `http://43.203.231.200:8080/api/v1/members/${payload.memberId}/profile`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// 회원가입 API 호출
export interface SignUpPayload {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    bio: string;
  }  
  
  export const signUp = async (payload: SignUpPayload): Promise<string> => {
    const { data } = await axios.post("http://43.203.231.200:8080/api/v1/members/signup", payload);
    return data.memberId;
  };
  
  export interface UploadImagePayload {
    file: File;
    memberId: string;
  }
  
  export const uploadImage = async (payload: UploadImagePayload): Promise<void> => {
    const formData = new FormData();
    formData.append("file", payload.file);
  
    await axios.post(
      `http://43.203.231.200:8080/api/v1/members/${payload.memberId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  };
  