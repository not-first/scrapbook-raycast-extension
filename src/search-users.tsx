import { Image, LaunchProps, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { User } from "../lib/types";
import { useState } from "react";

export default function SearchUsers(props: LaunchProps) {
  const { isLoading, data } = useFetch<User[]>("https://scrapbook.hackclub.com/api/users");
  const [enteredUsername, setEnteredUsername] = useState<string>(props.launchContext?.username);

  return (
    <List isLoading={isLoading} searchText={enteredUsername} isShowingDetail>
      {data?.map((user: User) => {
        return (
          <List.Item 
            key={user.id}
            title={user.username}
            icon={{ source: user.avatar, mask: Image.Mask.Circle }}
            detail={
                <List.Item.Detail.Metadata>
                    
                </List.Item.Detail.Metadata>
            }
          />
        );
      })}
    </List>
  );
}
