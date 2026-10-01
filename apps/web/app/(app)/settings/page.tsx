import { PagePlaceholder } from "@/components/page-placeholder"
import { team } from "@/lib/mock"

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Channels (LINE, email, SMS), team and outreach defaults."
      phase={4}
      stats={[
        { label: "Team members", value: team.length },
        { label: "Channels", value: 3 },
      ]}
    />
  )
}
