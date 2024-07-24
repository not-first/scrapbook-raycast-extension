import { Action, ActionPanel, Icon, Image, launchCommand, LaunchProps, LaunchType, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { User } from "../lib/types";

export default function SearchUsers(props: LaunchProps) {
  const { isLoading, data, revalidate } = useFetch<User[]>("https://scrapbook.hackclub.com/api/users");

  return (
    <List isLoading={isLoading} searchText={props.launchContext?.username} isShowingDetail>
      {data?.map((user: User) => {
        return (
          <List.Item
            key={user.id}
            title={user.username}
            icon={{ source: user.avatar, mask: Image.Mask.Circle }}
            detail={
              <List.Item.Detail metadata={
                <List.Item.Detail.Metadata >
                  <List.Item.Detail.Metadata.Label title="Name" icon={{source: user.avatar, mask: Image.Mask.Circle}} text={user.username} />
                  <List.Item.Detail.Metadata.Label title="Email" icon={Icon.Envelope} text={user.email || "No email"} />
                  <List.Item.Detail.Metadata.Link title="Website" text={user.website || "No website"} target={user.website || ""} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Link title="Github" text={user.github || "No Github"} target={user.github || ""} />
                  <List.Item.Detail.Metadata.Link title="Scrapbook Profile" text={"Open Scrapbook"} target={ user.customDomain || "https://scrapbook.hackclub.com/" + encodeURIComponent(user.username)} />
                <List.Item.Detail.Metadata.TagList title="IDs">
                  <List.Item.Detail.Metadata.TagList.Item text={user.id} />
                  <List.Item.Detail.Metadata.TagList.Item text={user.slackID || undefined} />
                </List.Item.Detail.Metadata.TagList>
              </List.Item.Detail.Metadata>
              }/>
            }
            actions={
              <ActionPanel>
                <Action
                title="View Posts"
                icon={Icon.Book}
                onAction={() => {
                  launchCommand({ name: "view-recent-posts", type: LaunchType.UserInitiated, context: { username: user.username } });
                }} />
                <Action.OpenInBrowser
                  title="Open Scrapbook Profile"
                  url={"https://scrapbook.hackclub.com/" + encodeURIComponent(user.username)}
                />
                <ActionPanel.Section>
                  <Action
                    title="Refresh"
                    icon={Icon.ArrowClockwise}
                    onAction={async () => revalidate()}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }

          />
        );
      })}
    </List>
  );
}
