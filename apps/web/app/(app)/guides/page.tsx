import { PagePlaceholder } from "@/components/page-placeholder"
import { guides } from "@/lib/mock"

export default function GuidesPage() {
  return (
    <PagePlaceholder
      title="Interview guides"
      description="Reusable definitions of an AI interview: intro, questions, outro and criteria."
      phase={4}
      stats={[
        { label: "Guides", value: guides.length },
        { label: "Questions", value: guides.reduce((n, g) => n + g.questions.length, 0) },
      ]}
    />
  )
}
