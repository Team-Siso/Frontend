import { useQuery } from "@tanstack/react-query";
import { fetchFriends, Friend } from "../../api/friend";

export const useFriendSearch = (query: string) => {
  return useQuery<Friend[], Error>({
    queryKey: ["friendSearch", query],
    queryFn: () => fetchFriends(query),
    enabled: !!query,
  });
};
