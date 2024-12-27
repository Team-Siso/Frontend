import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateToggleSetting } from "../../api/settings";

interface ToggleSettingParams {
  setting: string;
  value: boolean;
}

export const useToggleSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setting, value }: ToggleSettingParams) => updateToggleSetting(setting, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] }); // 캐시 무효화
      console.log("Setting updated successfully.");
    },
    onError: (error) => {
      console.error("Failed to update setting:", error);
      alert("설정 변경에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
