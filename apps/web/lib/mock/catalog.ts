import type { ActionType, NodeKind, NodeType, TriggerType, UtilityType } from "./types"

export type CatalogEntry<T extends NodeType = NodeType> = {
  type: T
  kind: NodeKind
  label: string
  description: string
  /** Phosphor icon name, resolved by the builder UI */
  icon: string
}

// PRD §4.2
export const triggers: CatalogEntry<TriggerType>[] = [
  { type: "new_application", kind: "trigger", label: "New Application", description: "A candidate applies or is added to the job", icon: "UserPlus" },
  { type: "candidate_matched", kind: "trigger", label: "Candidate Matched", description: "The platform matches a candidate to the job", icon: "MagnifyingGlass" },
  { type: "manually_invited", kind: "trigger", label: "Manually Invited", description: "A user invites a candidate from the dashboard", icon: "HandPointing" },
  { type: "interview_scheduled", kind: "trigger", label: "Interview Scheduled", description: "The candidate books an interview slot", icon: "CalendarCheck" },
  { type: "interview_started", kind: "trigger", label: "Interview Started", description: "The candidate starts the interview", icon: "Play" },
  { type: "interview_completed", kind: "trigger", label: "Interview Completed", description: "The candidate finishes the interview", icon: "CheckCircle" },
  { type: "interview_incomplete", kind: "trigger", label: "Interview Incomplete", description: "The candidate starts but does not finish", icon: "CircleHalf" },
  { type: "interview_missed", kind: "trigger", label: "Interview Missed", description: "The candidate does not show for a scheduled interview", icon: "CalendarX" },
  { type: "decision_updated", kind: "trigger", label: "Decision Updated", description: "The application's decision changes", icon: "Gavel" },
  { type: "webhook_received", kind: "trigger", label: "Webhook Received", description: "An external system calls the workflow's webhook URL", icon: "WebhooksLogo" },
]

// PRD §4.3
export const actions: CatalogEntry<ActionType>[] = [
  { type: "send_line", kind: "action", label: "Send LINE", description: "LINE message to the candidate", icon: "ChatCircleDots" },
  { type: "send_email", kind: "action", label: "Send Email", description: "Email to the candidate, recruiter or others", icon: "Envelope" },
  { type: "send_sms", kind: "action", label: "Send SMS", description: "Text message to the candidate", icon: "DeviceMobile" },
  { type: "create_note", kind: "action", label: "Create Note", description: "Add an internal note to the application", icon: "Note" },
  { type: "update_stage", kind: "action", label: "Update Application Stage", description: "Set the application's pipeline stage", icon: "Kanban" },
  { type: "update_decision", kind: "action", label: "Update Decision", description: "Shortlist, reject or reset the decision", icon: "Stamp" },
  { type: "update_field", kind: "action", label: "Update Field", description: "Set a field on the candidate or application", icon: "PencilSimple" },
  { type: "notify_team", kind: "action", label: "Notify Team", description: "Notify a recruiter or hiring manager", icon: "Bell" },
  { type: "webhook_request", kind: "action", label: "Webhook Request", description: "Send an HTTP request to an external endpoint", icon: "ArrowSquareOut" },
]

// PRD §4.4
export const utilities: CatalogEntry<UtilityType>[] = [
  { type: "initiate_outreach", kind: "utility", label: "Initiate Outreach", description: "Group of messages and waits that runs until the candidate responds", icon: "Megaphone" },
  { type: "move_to_round", kind: "utility", label: "Move to Round", description: "Move the application to another round", icon: "ArrowFatLinesRight" },
  { type: "wait", kind: "utility", label: "Wait", description: "Pause before the next step", icon: "Hourglass" },
  { type: "is", kind: "utility", label: "Is", description: "Branch on the platform's own fields (score, location...)", icon: "GitBranch" },
  { type: "filter", kind: "utility", label: "Filter", description: "Branch on the candidate, job or application", icon: "Funnel" },
]

export const catalog: CatalogEntry[] = [...triggers, ...actions, ...utilities]

const byType = new Map<NodeType, CatalogEntry>(catalog.map((e) => [e.type, e]))

export function getCatalogEntry(type: NodeType): CatalogEntry {
  const entry = byType.get(type)
  if (!entry) throw new Error(`Unknown node type: ${type}`)
  return entry
}

/** Steps allowed inside an Initiate Outreach group (PRD §4.4). */
export const outreachStepTypes: (ActionType | UtilityType)[] = [
  "send_line",
  "send_email",
  "send_sms",
  "wait",
]
