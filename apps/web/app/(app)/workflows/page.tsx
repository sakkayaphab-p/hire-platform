import { PagePlaceholder } from "@/components/page-placeholder"
import { catalog, savedBlocks, workflows } from "@/lib/mock"

export default function WorkflowsPage() {
  return (
    <PagePlaceholder
      title="Workflows"
      description="Application workflows automate the candidate journey, round by round."
      phase={2}
      stats={[
        { label: "Workflows", value: workflows.length },
        { label: "Published", value: workflows.filter((w) => w.status === "published").length },
        { label: "Saved and pre-made blocks", value: savedBlocks.length },
        { label: "Node types", value: catalog.length },
      ]}
    />
  )
}
