 export function timeAgo(inputDate) {
    const past = new Date(inputDate);
    const now = new Date();

    // Validate the parsed date
    if (isNaN(past.getTime())) {
        console.warn("Invalid date passed:", inputDate);
        return "Invalid date";
    }

    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} month ago`;

    return `${Math.floor(diffInSeconds / 31536000)} year(s) ago`;
}
