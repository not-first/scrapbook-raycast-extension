import { Action, ActionPanel, Icon, LaunchProps, List } from "@raycast/api";
import { PostType, UserType } from "./lib/types";
import { useFetch } from "@raycast/utils";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import Post from "./components/post";
import { ReactionsDropdown } from "./components/reactions-dropdown";

type UserInfo = {
  profile: UserType;
  posts: PostType[];
  webring: string[];
};

export default function SearchUsersPosts(props: LaunchProps) {
  const [searchText, setSearchText] = useState<string>(props.launchContext?.username || "");
  const [searchUsers, setSearchUsers] = useState<UserType[]>([]);
  const [directMatch, setDirectMatch] = useState<UserType | null>(null);
  const {
    isLoading: usersIsLoading,
    data: usersData,
    revalidate: usersRevalidate,
  } = useFetch<UserType[]>("https://scrapbook.hackclub.com/api/users");

  const { isLoading, data } = useFetch<UserInfo>(`https://scrapbook.hackclub.com/api/users/${searchText}`, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (usersData) {
      const fuse = new Fuse<UserType>(usersData, {
        keys: ["username"],
        threshold: 0.3,
      });

      const results = fuse.search(searchText);
      const topResults = results.slice(0, 10);

      if (topResults.length > 0 && topResults[0].item.username.toLowerCase() === searchText.toLowerCase()) {
        setDirectMatch(topResults[0].item);
        setSearchUsers(topResults.slice(1).map((result) => result.item));
        setSearchText(topResults[0].item.username);
      } else {
        setDirectMatch(null);
        setSearchUsers(topResults.map((result) => result.item));
      }
    }
  }, [usersData, searchText]);

  return (
    <List isLoading={isLoading} searchText={searchText} onSearchTextChange={setSearchText} throttle>
      {directMatch && data && data.posts ? (
        <List.Section title="Direct Match">
          <List.Item
            key={directMatch.id}
            title={directMatch.username}
            accessories={[
              { tag: { value: `${data.posts.length} posts` } },
              ...(data.profile.streaksToggledOff === false && data.profile.displayStreak === true
                ? [{ tag: { value: `${data.profile.streakCount} day streak` }, icon: Icon.Bolt }]
                : []),
            ]}
            icon={Icon.Person}
            actions={
              <ActionPanel>
                <Action.Push
                  title="View Profile"
                  icon={Icon.Person}
                  target={<UserPosts username={directMatch.username} />}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      ) : null}

      {searchUsers.length > 0 ? (
        <List.Section title="Other Users">
          {searchUsers.map((user) => (
            <List.Item
              key={user.id}
              title={user.username}
              icon={Icon.Person}
              actions={
                <ActionPanel>
                  <Action.Push
                    title="View Profile"
                    icon={Icon.Person}
                    target={<UserPosts username={user.username} />}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ) : (
        <List.EmptyView title="User not found" description="No user found for the current name" icon={Icon.Person} />
      )}
    </List>
  );
}

function UserPosts({ username }: { username: string }) {
  const [selectedReaction, setSelectedReaction] = useState<string>("");
  const { isLoading, data, revalidate } = useFetch<UserInfo>(`https://scrapbook.hackclub.com/api/users/${username}`);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <ReactionsDropdown
          posts={data?.posts || []}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
      }
    >
      {data?.posts.map((post: PostType) => (
        <Post key={post.id} post={post} setSelectedReaction={setSelectedReaction} />
      ))}
    </List>
  );
}
