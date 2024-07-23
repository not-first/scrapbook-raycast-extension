import { Icon, launchCommand, LaunchType, List, open } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { Post } from "../lib/types";

export default function ViewRecentPosts() {
  const { isLoading, data } = useFetch<Post[]>("https://scrapbook.hackclub.com/api/posts");

  return (
    <List isLoading={isLoading} isShowingDetail>
      {data?.map((post: Post) => {
        const readableDate = new Date(post.postedAt).toLocaleDateString("en-US", {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const readableTime = new Date(post.postedAt).toLocaleTimeString("en-US", {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        const fullReadableDateTime = `${readableDate} at ${readableTime}`;

        return (
          <List.Item
            key={post.id}
            title={post.text}
            subtitle={post.user.username}
            detail={<List.Item.Detail markdown={
              post.text + 
              post.attachments.map(a => `![${"image"}](${a})`).join("\n")
            }  metadata={
              <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Link title="Slack Link" target={post.slackUrl || ""} text={post.slackUrl ? "Open Slack" : "No Slack URL"}/>
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.TagList title="Reactions">
                    {post.reactions.map(reaction => {
                      return <List.Item.Detail.Metadata.TagList.Item key={reaction.name} icon={reaction.url}/>;
                    })}
                  </List.Item.Detail.Metadata.TagList>
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Date Posted" icon={Icon.Clock} text={fullReadableDateTime} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.TagList title="Author">
                      <List.Item.Detail.Metadata.TagList.Item color="Blue" icon={Icon.Person} text={post.user.username} onAction={async () => {
                        await launchCommand({name: "search-users", type: LaunchType.UserInitiated, context: {username: post.user.username}});
                      }}/>;
                  </List.Item.Detail.Metadata.TagList>
                </List.Item.Detail.Metadata>
            }/>}
          />
        );
      })}
    </List>
  );
}
