import { List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { Post } from "../lib/types";

export default function ViewRecentPosts() {
  const { isLoading, data } = useFetch<Post[]>("https://scrapbook.hackclub.com/api/posts");

  return (
    <List isLoading={isLoading}>
      {data?.map((post: Post) => <List.Item key={post.id} title={post.text} subtitle={post.user.username} />)}
    </List>
  );
}
