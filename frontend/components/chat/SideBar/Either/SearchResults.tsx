import { useSearchUsers } from "@/hooks/useSearchUsers";
import UserSearchCard from "../UserSearchCard";

type SearchResultsProps = {
    query: string;
};

export default function SearchResults({
    query,
}: SearchResultsProps) {

    const { data, isLoading, isError } = useSearchUsers(query);

    if (isLoading) {
        return (
            <p className="p-4 text-sm text-slate-400">
                Searching...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="p-4 text-sm text-red-500">
                Failed to search users.
            </p>
        );
    }

    if (!data || data.users.length === 0) {
        return (
            <p className="p-4 text-sm text-slate-400">
                No users found.
            </p>
        );
    }


    return (
        <div>
            {data.users.map((user) => (
                <UserSearchCard
                    key={user.id}
                    id={user.id}
                    username={user.username}
                    email={user.email}
                    relationship={user.relationship}
                    conversationId={user.conversationId}
                />
            ))}
        </div>
    );
}