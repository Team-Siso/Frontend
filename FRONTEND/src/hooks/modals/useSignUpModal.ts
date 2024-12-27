import { useMutation } from "@tanstack/react-query";
import { signUp, uploadImage, SignUpPayload, UploadImagePayload } from "../../api/member";
import { useNavigate } from "react-router-dom";
import { useSignUpStore } from "../../store/modals/useSignUpStore";

export const useSignUpModal = (onClose: () => void) => {
  const navigate = useNavigate();
  const { password, confirmPassword, nickname, bio, file, setFile, setProfilePic, reset } =
    useSignUpStore();

  // React Query Mutations
  const signUpMutation = useMutation<string, Error, SignUpPayload>({
    mutationFn: signUp, // 올바르게 mutationFn만 전달
  });

  const uploadImageMutation = useMutation<void, Error, UploadImagePayload>({
    mutationFn: uploadImage, // 올바르게 mutationFn만 전달
  });

  const openStep2 = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    useSignUpStore.setState({ isStep2Open: true });
  };

  const closeStep2 = () => {
    useSignUpStore.setState({ isStep2Open: false });
    onClose();
    reset();
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (email: string) => {
    try {
      const payload: SignUpPayload = {
        email,
        password,
        confirmPassword,
        nickname,
        bio,
      };
  
      // 회원가입 요청
      const memberId = await signUpMutation.mutateAsync(payload);
      console.log("회원가입 성공: memberId:", memberId);
  
      // 로컬 스토리지에 저장
      localStorage.setItem("memberId", memberId);
      console.log("로컬스토리지 저장 확인: memberId:", localStorage.getItem("memberId"));
  
      if (file) {
        const uploadPayload: UploadImagePayload = { file, memberId };
        await uploadImageMutation.mutateAsync(uploadPayload);
      }
  
      onClose();
      reset();
      navigate("/main");
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };  

  return {
    openStep2,
    closeStep2,
    handleProfilePicChange,
    handleSubmit,
  };
};
