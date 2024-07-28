import { Action, ActionPanel, Icon, launchCommand, LaunchType } from "@raycast/api";
import { PostType, UserType } from "../lib/types";

export function RefreshAction({ revalidate }: { revalidate: () => void }) {
  return <Action title="Refresh" icon={Icon.ArrowClockwise} onAction={async () => revalidate()} />;
}

export function UserCommandActions({ user }: { user: UserType }) {
  return (
    <ActionPanel.Section>
      <Action
        title="View User's Posts"
        icon={Icon.Book}
        onAction={() =>
          launchCommand({
            name: "search-users-posts",
            type: LaunchType.UserInitiated,
            context: { username: user.username },
          })
        }
      />
    </ActionPanel.Section>
  );
}

export function UserCopyActions({ user }: { user: UserType }) {
  return (
    <ActionPanel.Section>
      {user.username && <Action.CopyToClipboard title="Copy Username" content={user.username} />}
      {user.username && <Action.CopyToClipboard title="Copy Username" content={user.username} />}
      {user.email && <Action.CopyToClipboard title="Copy Email" content={user.email} />}
      {user.website && <Action.CopyToClipboard title="Copy Website" content={user.website} />}
      {user.github && <Action.CopyToClipboard title="Copy Github" content={user.github} />}
      <Action.CopyToClipboard
        title="Copy Scrapbook Profile"
        content={user.customDomain || `https://scrapbook.hackclub.com/${encodeURIComponent(user.username)}`}
      />
      {user.id && <Action.CopyToClipboard title="Copy Scrapbook ID" content={user.id} />}
      {user.slackID && <Action.CopyToClipboard title="Copy Slack ID" content={user.slackID} />}
    </ActionPanel.Section>
  );
}

export function PostOpenActions({ post }: { post: PostType }) {
  return (
    <ActionPanel.Section>
      {post.slackUrl && <Action.OpenInBrowser title="Open In Slack" icon={Icon.Link} url={post.slackUrl} />}
    </ActionPanel.Section>
  );
}
