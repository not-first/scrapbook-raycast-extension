import { Action, ActionPanel, Color, Icon, launchCommand, LaunchProps, LaunchType, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { Post, Reaction } from "./lib/types";
import { reactionReadableName } from "./lib/utils";
import { useEffect, useState } from "react";

const colors = [Color.Magenta, Color.Red, Color.Blue, Color.Green, Color.Yellow, Color.Purple, Color.Orange];

export default function ViewRecentPosts(props: LaunchProps) {
  const {
    isLoading: isPostsLoading,
    data: postsData,
    revalidate: postsRevalidate,
  } = useFetch<Post[]>("https://scrapbook.hackclub.com/api/posts");

  const [selectedReaction, setSelectedReaction] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Post[] | undefined>(undefined);

  const uniqueReactions = postsData
    ? Array.from(
        postsData
          .flatMap((post) => post.reactions)
          .reduce((map, reaction) => {
            if (!map.has(reaction.name)) {
              map.set(reaction.name, reaction);
            }
            return map;
          }, new Map())
          .values(),
      )
    : [];

  useEffect(() => {
    if (selectedReaction && selectedReaction !== "") {
      setFilteredData(
        postsData?.filter((post) => post.reactions.some((reaction) => reaction.name === selectedReaction)),
      );
    } else {
      setFilteredData(postsData);
    }
  }, [selectedReaction, postsData]);

  return (
    <List
      isLoading={isPostsLoading}
      searchBarAccessory={
        <ReactionsDropdown reactions={uniqueReactions} selectedReaction={selectedReaction} setSelectedReaction={setSelectedReaction} launchProps={props} />
      }
      isShowingDetail
    >
      {filteredData?.map((post: Post) => {
        const readableDate = new Date(post.postedAt).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const readableTime = new Date(post.postedAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        const fullReadableDateTime = `${readableDate} at ${readableTime}`;

        return (
          <List.Item
            key={post.id}
            title={post.text}
            subtitle={post.user.username}
            detail={
              <List.Item.Detail
                markdown={post.text + post.attachments.map((a) => `![${"image"}](${a})`).join("\n")}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.TagList title="Reactions">
                      {post.reactions.map((reaction) => {
                        return (
                          <List.Item.Detail.Metadata.TagList.Item
                            key={reaction.name}
                            icon={reaction.url}
                            text={reactionReadableName(reaction.name)}
                            onAction={() => {
                              setSelectedReaction(reaction.name);
                            }}
                          />
                        );
                      })}
                    </List.Item.Detail.Metadata.TagList>
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label
                      title="Date Posted"
                      icon={Icon.Clock}
                      text={fullReadableDateTime}
                    />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.TagList title="Author">
                      <List.Item.Detail.Metadata.TagList.Item
                        color={colors[Math.floor(Math.random() * colors.length)]}
                        icon={Icon.Person}
                        text={post.user.username}
                        onAction={async () => {
                          await launchCommand({
                            name: "search-users",
                            type: LaunchType.UserInitiated,
                            context: { username: post.user.username },
                          });
                        }}
                      />
                    </List.Item.Detail.Metadata.TagList>
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Link
                      title="Slack Link"
                      target={post.slackUrl || ""}
                      text={post.slackUrl ? "Open Slack" : "No Slack URL"}
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <Action title="Refresh" icon={Icon.ArrowClockwise} onAction={async () => postsRevalidate()} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

function ReactionsDropdown(props: {
  reactions: Reaction[];
  selectedReaction: string;
  setSelectedReaction: (user: string) => void;
  launchProps: LaunchProps;
}) {
  const { reactions, selectedReaction, setSelectedReaction } = props;
  return (
    <>
      <List.Dropdown
        tooltip="Select User"
        value={selectedReaction}
        onChange={(selectedItem) => {
          setSelectedReaction(selectedItem);
        }}
      >
        <List.Dropdown.Item title="All Posts" value={""} />
        <List.Dropdown.Section title="Reactions">
          {reactions.map((reaction: Reaction) => (
            <List.Dropdown.Item
              key={reaction.name}
              title={reactionReadableName(reaction.name)}
              value={reaction.name}
              icon={reaction.url}
            />
          ))}
        </List.Dropdown.Section>
      </List.Dropdown>
    </>
  );
}
