import { Icon, LaunchProps, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { UserType } from "./lib/types";
import UserView from "./components/user";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";

export default function SearchUsers(props: LaunchProps) {
  const [searchText, setSearchText] = useState<string>(props.launchContext?.username || "");
  const { isLoading, data, revalidate } = useFetch<UserType[]>("https://scrapbook.hackclub.com/api/users", {
    execute: searchText.length > 0,
  });
  const [filteredUsers, setFilteredUsers] = useState<UserType[] | undefined>(undefined);

  useEffect(() => {
    if (data) {
      const fuse = new Fuse<UserType>(data, {
        keys: ["username"],
        threshold: 0.3,
      });

      const results = fuse.search(searchText);
      setFilteredUsers(results.map((result) => result.item));
    }
  }, [data, searchText]);

  return (
    <List isLoading={isLoading} searchText={searchText} onSearchTextChange={setSearchText} isShowingDetail throttle>
      <List.EmptyView title="No Users Found" description="Begin typing to search" icon={Icon.Person} />
      {filteredUsers?.map((user: UserType) => <UserView key={user.id} user={user} revalidate={revalidate} />)}
    </List>
  );
}
