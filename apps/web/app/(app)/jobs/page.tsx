import { PagePlaceholder } from "@/components/page-placeholder"
import { applications, candidates, jobs } from "@/lib/mock"

export default function JobsPage() {
  return (
    <PagePlaceholder
      title="Jobs"
      description="Every job has one application workflow and one or more rounds."
      phase={1}
      stats={[
        { label: "Jobs", value: jobs.length },
        { label: "Open jobs", value: jobs.filter((j) => j.status === "open").length },
        { label: "Candidates", value: candidates.length },
        { label: "Applications", value: applications.length },
      ]}
    />
  )
}
