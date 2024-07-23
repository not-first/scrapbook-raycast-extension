import { List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { Post } from "../lib/types";

export default function ViewRecentPosts() {
  const { isLoading, data } = useFetch<Post[]>("https://scrapbook.hackclub.com/api/posts");

  return (
    <List isLoading={isLoading} isShowingDetail>
      {data?.map((post: Post) => (
        <List.Item
          key={post.id}
          title={post.text}
          subtitle={post.user.username}
          detail={<List.Item.Detail markdown={
            post.text + 
            post.attachments.map(a => `![${"image"}](${a})`).join("\n")
          }  metadata={
            <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Link title="Slack Link" target={post.slackUrl} text={"Open Slack"}/>
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.TagList title="Reactions">
                  {post.reactions.map(reaction => {
                    return <List.Item.Detail.Metadata.TagList.Item key={reaction.name} icon={reaction.url}/>;
                  })}
                </List.Item.Detail.Metadata.TagList>
              </List.Item.Detail.Metadata>
          }/>}
        />
      ))}
    </List>
  );
}
