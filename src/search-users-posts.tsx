import { Icon, LaunchProps, List } from "@raycast/api";
import { Post, User } from "./lib/types";
import { useFetch } from "@raycast/utils";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

type UserInfo = {
  profile: User;
  posts: Post[];
  webring: string[];
};

export default function SearchUsersPosts(props: LaunchProps) {
  const [searchText, setSearchText] = useState<string>(props.launchContext?.username || "");
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [directMatch, setDirectMatch] = useState<User | null>(null);
  const { isLoading: usersIsLoading, data: usersData, revalidate: usersRevalidate } = useFetch<User[]>("https://scrapbook.hackclub.com/api/users");

  const { isLoading, data } = useFetch<UserInfo>(`https://scrapbook.hackclub.com/api/users/${searchText}`, { keepPreviousData: true });

  useEffect(() => {
    if (usersData) {
      const fuse = new Fuse<User>(usersData, {
        keys: ["username"],
        threshold: 0.3,
      });

      const results = fuse.search(searchText);
      const topResults = results.slice(0, 10);

      if (topResults.length > 0 && topResults[0].item.username.toLowerCase() === searchText.toLowerCase()) {
        setDirectMatch(topResults[0].item);
        setSearchUsers(topResults.slice(1).map(result => result.item));
        setSearchText(topResults[0].item.username);
      } else {
        setDirectMatch(null);
        setSearchUsers(topResults.map(result => result.item));
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
          />
        </List.Section>
      ) : null}

      {searchUsers.length > 0 ? (
        <List.Section title="Close Matches">
          {searchUsers.map(user => (
            <List.Item
              key={user.id}
              title={user.username}
              icon={Icon.Person}
            />
          ))}
        </List.Section>
      ) : (
        <List.EmptyView title="User not found" description="No user found for the current name" icon={Icon.Person} />
      )}
    </List>
  );
}
