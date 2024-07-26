import { LaunchProps, List } from "@raycast/api";
import { Post, User } from "./lib/types";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

type UserInfo = {
    profile: User
    posts: Post[]
    webring: string[]
}

export default function SearchUsersPosts(props: LaunchProps) {
    const [searchText, setSearchText] = useState<string>("");
    const { isLoading, data } = useFetch<UserInfo>(`https://scrapbook.hackclub.com/api/users/${searchText}`, { keepPreviousData: true });

    return (
        <List isLoading={isLoading} searchText={searchText} onSearchTextChange={setSearchText} throttle>
            
        </List>
    )
}