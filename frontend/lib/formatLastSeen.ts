export function formatLastSeen(lastSeen: string | null) {
    if (!lastSeen) {
        return "Offline";
    }

    const date = new Date(lastSeen);

    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
        return "Last seen just now";
    }

    if (minutes < 60) {
        return `Last seen ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    return `Last seen ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })}`;
}