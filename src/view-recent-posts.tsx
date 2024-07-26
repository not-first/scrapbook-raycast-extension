import { LaunchProps, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { Post as PostType, Reaction } from "./lib/types";
import { reactionReadableName } from "./lib/utils";
import { useEffect, useState } from "react";
import Post from "./components/post";

export default function ViewRecentPosts(props: LaunchProps) {
  const {
    isLoading: isPostsLoading,
    data: postsData,
    revalidate: postsRevalidate,
  } = useFetch<PostType[]>("https://scrapbook.hackclub.com/api/posts");

  const [selectedReaction, setSelectedReaction] = useState<string>("");
  const [filteredData, setFilteredData] = useState<PostType[] | undefined>(undefined);

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
        <ReactionsDropdown
          reactions={uniqueReactions}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          launchProps={props}
        />
      }
      isShowingDetail
    >
      {filteredData?.map((post: PostType) => (
        <Post key={post.id} post={post} setSelectedReaction={setSelectedReaction} revalidate={postsRevalidate} />
      ))}
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
