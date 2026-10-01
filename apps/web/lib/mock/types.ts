// Mock domain types, shaped after docs/prd/application-workflows.md §3 and §6.

export type RoundType = "ai" | "human"
export type Decision = "pending" | "shortlisted" | "rejected" | "hired"
export type Channel = "line" | "email" | "sms"
export type JobStatus = "open" | "paused" | "closed"
export type WorkflowStatus = "draft" | "published"

export type TriggerType =
  | "new_application"
  | "candidate_matched"
  | "manually_invited"
  | "interview_scheduled"
  | "interview_started"
  | "interview_completed"
  | "interview_incomplete"
  | "interview_missed"
  | "decision_updated"
  | "webhook_received"

export type ActionType =
  | "send_email"
  | "send_sms"
  | "send_line"
  | "create_note"
  | "update_stage"
  | "update_decision"
  | "update_field"
  | "notify_team"
  | "webhook_request"

export type UtilityType =
  | "initiate_outreach"
  | "move_to_round"
  | "wait"
  | "is"
  | "filter"

export type NodeKind = "trigger" | "action" | "utility"
export type NodeType = TriggerType | ActionType | UtilityType

export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "is_empty"
  | "is_not_empty"

export type ConditionStatement = {
  field: string
  operator: ConditionOperator
  value?: string | number
}

/** Statements inside a set are ANDed; sets are ORed (PRD §4.5). */
export type ConditionSet = ConditionStatement[]

export type NodeConfig = {
  /** Message nodes */
  subject?: string
  body?: string
  recipient?: "candidate" | "recruiter" | "hiring_manager"
  /** Wait */
  durationMinutes?: number
  /** Move to round */
  targetRound?: number
  /** Is / Filter */
  entity?: "application" | "candidate" | "job"
  conditions?: ConditionSet[]
  /** Update nodes */
  field?: string
  value?: string
  /** Webhook request */
  url?: string
}

export type WorkflowNode = {
  id: string
  kind: Exclude<NodeKind, "trigger">
  type: ActionType | UtilityType
  config?: NodeConfig
  /** Steps inside an Initiate Outreach group */
  children?: WorkflowNode[]
  /** Branches of an Is / Filter node */
  yes?: WorkflowNode[]
  no?: WorkflowNode[]
}

export type Block = {
  id: string
  trigger: TriggerType
  steps: WorkflowNode[]
}

export type WorkflowRound = {
  /** 1-based, matches the job's round order */
  index: number
  name: string
  blocks: Block[]
}

export type OutreachSettings = {
  start: string
  end: string
  timezone: string
  intake: "on_invite" | "on_engagement" | "after_interview"
}

export type Workflow = {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  version: number
  updatedAt: string
  updatedBy: string
  rounds: WorkflowRound[]
  settings: OutreachSettings
}

export type SavedBlock = {
  id: string
  name: string
  description: string
  premade: boolean
  block: Block
}

export type GuideQuestion = {
  id: string
  text: string
  criteria?: string
}

export type InterviewGuide = {
  id: string
  name: string
  kind: "generic" | "role" | "job"
  language: "th" | "en"
  intro: string
  questions: GuideQuestion[]
  outro: string
  criteria: string[]
  questionLimit: number
}

export type JobRound = {
  index: number
  name: string
  type: RoundType
  guideId?: string
}

export type Job = {
  id: string
  title: string
  department: string
  location: string
  status: JobStatus
  description: string
  workflowId: string
  rounds: JobRound[]
  createdAt: string
}

export type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  lineId?: string
  location: string
  headline: string
  preferredChannel: Channel
}

export type Application = {
  id: string
  jobId: string
  candidateId: string
  round: number
  stage: string
  decision: Decision
  score?: number
  source: "apply_link" | "line" | "crm" | "matched" | "manual"
  appliedAt: string
  lastActivityAt: string
  /** Id of the workflow node (or block trigger) the application is currently at */
  currentNodeId?: string
}

export type StepStatus = "success" | "failed" | "cancelled" | "waiting"

export type StepExecution = {
  id: string
  nodeId: string
  label: string
  status: StepStatus
  at: string
  error?: string
}

export type WorkflowRun = {
  id: string
  applicationId: string
  workflowId: string
  round: number
  blockId: string
  status: "running" | "completed" | "failed"
  steps: StepExecution[]
}

export type HistoryChange = {
  kind: "added" | "removed" | "changed"
  round: number
  target: string
  detail: string
}

export type HistoryEntry = {
  id: string
  workflowId: string
  version: number
  author: string
  at: string
  summary: string
  changes: HistoryChange[]
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: "admin" | "recruiter" | "hiring_manager"
}
