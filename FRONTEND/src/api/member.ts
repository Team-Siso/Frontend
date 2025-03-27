import axios from "axios";

export interface MemberProfile {
  nickName: string;
  email: string;
  introduce: string;
  profileUrl: string;
}

export interface UpdateProfilePayload {
  memberId: string;
  nickname: string;
  bio: string;
  profilePic?: File | null;
}

// 사용자 프로필 조회
export const fetchMemberProfile = async (memberId: string): Promise<MemberProfile> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/members/${memberId}`);
  return data;
};

// 프로필 업데이트
export const updateMemberProfile = async (payload: UpdateProfilePayload): Promise<void> => {
  const formData = new FormData();
  formData.append("nickname", payload.nickname);
  formData.append("introduce", payload.bio);
  if (payload.profilePic) {
    formData.append("profilePic", payload.profilePic);
  }
  await axios.post(`${import.meta.env.VITE_API_URL}/members/${payload.memberId}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 프로필 이미지 업로드 (별도 API 호출)
export const uploadImage = async ({
  file,
  memberId,
}: {
  file: File;
  memberId: string;
}): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  await axios.post(`${import.meta.env.VITE_API_URL}/members/${memberId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
