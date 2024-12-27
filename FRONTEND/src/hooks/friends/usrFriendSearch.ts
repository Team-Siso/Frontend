import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFriends, Friend } from "../../api/friend";

export const useFriendSearch = (searchTerm: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<Friend[], Error>({
    queryKey: ["friendsSearch", searchTerm],
    queryFn: () => fetchFriends(searchTerm),
    enabled: false, // 수동으로 트리거됨
    refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
  });

  const handleSearch = (newSearchTerm: string) => {
    queryClient.cancelQueries({ queryKey: ["friendsSearch"] });
    query.refetch();
  };

  return { ...query, handleSearch };
};
