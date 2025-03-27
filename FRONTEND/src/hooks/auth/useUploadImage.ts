import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../../api/auth";

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: ({ file, memberId }: { file: File; memberId: string }) =>
      uploadImage({ file, memberId }),
    onSuccess: () => {
      console.log("이미지 업로드 성공");
    },
    onError: (error) => {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    },
  });
};
