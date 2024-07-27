import { Action, Icon } from "@raycast/api";

export function RefreshAction({ revalidate }: { revalidate: () => void }) {
  return <Action title="Refresh" icon={Icon.ArrowClockwise} onAction={async () => revalidate()} />;
}
