import { Action, ActionPanel, Color, Icon, Image, launchCommand, LaunchProps, LaunchType, List } from "@raycast/api";
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
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label
                      title="Name"
                      icon={{ source: user.avatar, mask: Image.Mask.Circle }}
                      text={user.username}
                    />
                    {/* {user.pronouns ? (
                      <List.Item.Detail.Metadata.Label
                        title="Pronouns"
                        text={user.pronouns}
                        icon={Icon.SpeechBubbleActive}
                      />
                    ) : undefined}
                    {user.timezone ? (
                      <List.Item.Detail.Metadata.Label title="Timezone" text={user.timezone} icon={Icon.Clock} />
                    ) : undefined} */}
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label
                      title="Email"
                      icon={Icon.Envelope}
                      text={user.email || "No email"}
                    />
                    <List.Item.Detail.Metadata.Link
                      title="Website"
                      text={user.website || "No website"}
                      target={user.website || ""}
                    />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Link
                      title="Github"
                      text={user.github || "No Github"}
                      target={user.github || ""}
                    />
                    <List.Item.Detail.Metadata.Link
                      title="Scrapbook Profile"
                      text={"Open Scrapbook"}
                      target={
                        user.customDomain || "https://scrapbook.hackclub.com/" + encodeURIComponent(user.username)
                      }
                    />
                    {user.displayStreak == true &&
                    (user.streaksToggledOff == null || user.streaksToggledOff == false) ? (
                      <>
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label
                          title="Streak Count"
                          icon={Icon.Bolt}
                          text={user.streakCount?.toString()}
                        />
                        <List.Item.Detail.Metadata.Label
                          title="Highest Streak"
                          icon={Icon.BoltDisabled}
                          text={user.maxStreaks?.toString()}
                        />
                      </>
                    ) : undefined}
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.TagList title="Member Status">
                      {user.newMember ? (
                        <List.Item.Detail.Metadata.TagList.Item text={"New Member"} color={Color.Blue} />
                      ) : (
                        <List.Item.Detail.Metadata.TagList.Item text={"-"} />
                      )}
                      {user.fullSlackMember ? (
                        <List.Item.Detail.Metadata.TagList.Item text={"Full Slack Member"} color={Color.Green} />
                      ) : (
                        <List.Item.Detail.Metadata.TagList.Item text={"-"} />
                      )}
                      <List.Item.Detail.Metadata.TagList.Item text={user.slackID || undefined} />
                    </List.Item.Detail.Metadata.TagList>
                    <List.Item.Detail.Metadata.TagList title="Scrapbook ID">
                      <List.Item.Detail.Metadata.TagList.Item text={user.id} />
                      <List.Item.Detail.Metadata.TagList.Item text={user.slackID || undefined} />
                    </List.Item.Detail.Metadata.TagList>
                    {user.slackID ? (
                      <List.Item.Detail.Metadata.TagList title="Slack ID">
                        <List.Item.Detail.Metadata.TagList.Item text={user.slackID} />
                      </List.Item.Detail.Metadata.TagList>
                    ) : undefined}
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <Action
                  title="View Posts"
                  icon={Icon.Book}
                  onAction={() => {
                    launchCommand({
                      name: "view-recent-posts",
                      type: LaunchType.UserInitiated,
                      context: { username: user.username },
                    });
                  }}
                />
                <Action.OpenInBrowser
                  title="Open Scrapbook Profile"
                  url={"https://scrapbook.hackclub.com/" + encodeURIComponent(user.username)}
                />
                <ActionPanel.Section>
                  <Action title="Refresh" icon={Icon.ArrowClockwise} onAction={async () => revalidate()} />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

// {
//   "id": "clfclkh7301uaqfqh6ytlhl33",
//   "slackID": "U019FRW4A7N",
// },
