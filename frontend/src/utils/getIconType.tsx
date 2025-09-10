export const getIconType = (link: string): "Youtube" | "Twitter" | "Notion" => {
    if (link.includes("youtube.com") || link.includes("youtu.be")) {
        return "Youtube";
    } else if (link.includes("twitter.com")) {
        return "Twitter";
    } else if (link.includes("notion.so")) {
        return "Notion";
    } else {
        return "Notion";
    }
};
