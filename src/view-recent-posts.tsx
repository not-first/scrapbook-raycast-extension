import { List } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function ViewRecentPosts() {
    const { isLoading, data, revalidate } = useFetch("https://scrapbook.hackclub.com/api/posts");

    return (
        <List></List>
    )

}