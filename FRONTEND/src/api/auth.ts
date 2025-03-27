import axios from "axios";

export const login = async (email: string, password: string): Promise<{ memberId: string }> => {
    // params 옵션을 사용하여 URL 쿼리 파라미터로 전송합
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/members/login`,
      null,
      { params: { email, password } }
    );
    if (response.status !== 200) {
      throw new Error("로그인 실패");
    }
    return response.data;
  };
export const signUp = async ({
  email,
  password,
  confirmPassword,
  nickname,
  bio,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  bio: string;
}): Promise<{ memberId: string }> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/signup`, {
    email,
    password,
    confirmPassword,
    nickName: nickname,
    introduce: bio,
  });
  if (response.status !== 200) {
    throw new Error("회원가입 실패");
  }
  return response.data;
};

export const uploadImage = async ({ file, memberId }: { file: File; memberId: string }): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  await axios.post(`${import.meta.env.VITE_API_URL}/members/${memberId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const validateEmailApi = async (email: string): Promise<string> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/members/valid?email=${encodeURIComponent(email)}`);
  return response.data;
};
