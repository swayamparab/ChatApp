import { api } from "@/lib/api";
import { SearchUsersResponse, UpdateProfileRequest, UpdateProfileResponse } from "@/types/users";

export async function updateProfile(
    data: UpdateProfileRequest
) {
    const response =
        await api.patch<UpdateProfileResponse>("/users/profile",
            data
        );

    return response.data;
}

export async function searchUsers(query: string) {
    const { data } = await api.get<SearchUsersResponse>("/users/search", {
        params: {
            q: query,
        },
    });

    return data;
}