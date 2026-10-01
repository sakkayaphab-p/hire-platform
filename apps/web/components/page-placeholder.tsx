import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function PagePlaceholder({
  title,
  description,
  phase,
  stats,
}: {
  title: string
  description: string
  phase: number
  stats: { label: string; value: number }[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          This page is built in Phase {phase} of the mock plan
          (docs/plans/mock-page-flow.md).
        </CardContent>
      </Card>
    </div>
  )
}
