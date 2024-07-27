import { List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { PostType } from "./lib/types";
import { useEffect, useState } from "react";
import Post from "./components/post";
import { ReactionsDropdown } from "./components/reactions-dropdown";

export default function ViewRecentPosts() {
  const {
    isLoading: isPostsLoading,
    data: postsData,
    revalidate: postsRevalidate,
  } = useFetch<PostType[]>("https://scrapbook.hackclub.com/api/posts");

  const [selectedReaction, setSelectedReaction] = useState<string>("");
  const [filteredData, setFilteredData] = useState<PostType[] | undefined>(undefined);

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
          posts={postsData || []}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
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
