import { api } from "@/lib/api";
import { SearchUsersResponse } from "@/types/users";

export async function searchUsers(query: string) {
    const { data } = await api.get<SearchUsersResponse>("/users/search", {
        params: {
            q: query,
        },
    });

    return data;
}