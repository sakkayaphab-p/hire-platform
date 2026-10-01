import type {
  Application,
  Candidate,
  Channel,
  Decision,
  StepStatus,
  WorkflowRun,
} from "./types"

const people: [name: string, headline: string, location: string][] = [
  ["Somchai Prasert", "Frontend developer, 6 yrs", "Bangkok"],
  ["Suda Kittisak", "React engineer at a fintech", "Bangkok"],
  ["Narong Boonmee", "Full-stack developer", "Chiang Mai"],
  ["Pimchanok Thongdee", "UI engineer, design systems", "Bangkok"],
  ["Wichai Saetang", "Web developer, e-commerce", "Nonthaburi"],
  ["Kamonwan Jaidee", "Frontend lead", "Bangkok"],
  ["Thanakorn Limsakul", "Junior web developer", "Khon Kaen"],
  ["Siriporn Maneerat", "Software engineer", "Bangkok"],
  ["Arthit Phromma", "Recruiter, tech hiring", "Bangkok"],
  ["Chutima Rungroj", "HR generalist", "Pathum Thani"],
  ["Preecha Sukjai", "Talent sourcer", "Bangkok"],
  ["Waraporn Inthara", "Recruitment consultant", "Bangkok"],
  ["Kittipong Yodrak", "HR coordinator", "Chonburi"],
  ["Malee Chanthara", "Agency recruiter, 4 yrs", "Bangkok"],
  ["Sakchai Duangdee", "People operations", "Bangkok"],
  ["Rattana Phetcharat", "Cashier, convenience store", "Bangkok"],
  ["Boonsong Kaewmanee", "Barista", "Bangkok"],
  ["Nipa Srisawat", "Sales assistant", "Samut Prakan"],
  ["Anucha Thammarat", "Stock clerk", "Bangkok"],
  ["Ladda Poolsawat", "Student, part-time", "Bangkok"],
  ["Surasak Nimnuan", "Restaurant staff", "Nonthaburi"],
  ["Jintana Homhuan", "Shop assistant", "Bangkok"],
  ["Pongsak Butsri", "Delivery rider", "Bangkok"],
  ["Orawan Singthong", "Retail supervisor", "Bangkok"],
  ["Manop Klinhom", "Warehouse picker", "Samut Prakan"],
  ["Sunisa Tongkam", "Packing staff", "Samut Prakan"],
  ["Decha Wongyai", "Forklift operator", "Chachoengsao"],
  ["Apinya Sangthong", "Inventory clerk", "Samut Prakan"],
  ["Yuthana Meesuk", "Loader", "Bangkok"],
  ["Benjawan Noisri", "Warehouse admin", "Samut Prakan"],
]

const channels: Channel[] = ["line", "line", "email", "line", "sms"]

function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, ".")
}

export const candidates: Candidate[] = people.map(([name, headline, location], i) => ({
  id: `cand-${String(i + 1).padStart(2, "0")}`,
  name,
  email: `${slug(name)}@mail.example`,
  phone: `+66 8${(i % 9) + 1} 555 ${String(1000 + i * 37).slice(0, 4)}`,
  lineId: i % 5 === 2 ? undefined : `@${slug(name).replace(".", "_")}`,
  location,
  headline,
  preferredChannel: channels[i % channels.length]!,
}))

type StepTemplate = [nodeId: string, label: string, status: StepStatus, error?: string]

type StateTemplate = {
  round: number
  stage: string
  decision: Decision
  score?: number
  blockId: string
  currentNodeId: string
  runStatus: WorkflowRun["status"]
  steps: StepTemplate[]
}

const invitedSteps: StepTemplate[] = [
  ["b-new-app", "New Application", "success"],
  ["n-is-qualified", "Is: resume score ≥ 60", "success"],
  ["n-note-qualified", "Create Note", "success"],
  ["n-outreach-r1", "Initiate Outreach", "success"],
  ["n-line-invite", "Send LINE", "success"],
]

const standardStates: StateTemplate[] = [
  {
    round: 1,
    stage: "Invited",
    decision: "pending",
    blockId: "b-new-app",
    currentNodeId: "n-wait-1h",
    runStatus: "running",
    steps: [...invitedSteps, ["n-wait-1h", "Wait 1 hour", "waiting"]],
  },
  {
    round: 1,
    stage: "Interview scheduled",
    decision: "pending",
    blockId: "b-new-app",
    currentNodeId: "n-outreach-r1",
    runStatus: "completed",
    steps: [
      ...invitedSteps,
      ["n-wait-1h", "Wait 1 hour", "cancelled"],
      ["n-email-invite", "Send Email", "cancelled"],
      ["n-sms-reminder", "Send SMS", "cancelled"],
    ],
  },
  {
    round: 1,
    stage: "Rejected",
    decision: "rejected",
    blockId: "b-new-app",
    currentNodeId: "n-email-decline",
    runStatus: "completed",
    steps: [
      ["b-new-app", "New Application", "success"],
      ["n-is-qualified", "Is: resume score ≥ 60", "success"],
      ["n-reject-unqualified", "Update Decision: rejected", "success"],
      ["n-email-decline", "Send Email", "success"],
    ],
  },
  {
    round: 2,
    stage: "Round 2 invited",
    decision: "pending",
    score: 72,
    blockId: "b-completed",
    currentNodeId: "n-move-r2",
    runStatus: "completed",
    steps: [
      ["b-completed", "Interview Completed", "success"],
      ["n-store-score", "Update Field: score", "success"],
      ["n-note-report", "Create Note", "success"],
      ["n-is-score", "Is: score > 50", "success"],
      ["n-notify-pass", "Notify Team", "success"],
      ["n-move-r2", "Move to Round 2", "success"],
    ],
  },
  {
    round: 1,
    stage: "Rejected",
    decision: "rejected",
    score: 38,
    blockId: "b-completed",
    currentNodeId: "n-line-decline",
    runStatus: "failed",
    steps: [
      ["b-completed", "Interview Completed", "success"],
      ["n-store-score", "Update Field: score", "success"],
      ["n-note-report", "Create Note", "success"],
      ["n-is-score", "Is: score > 50", "success"],
      ["n-line-decline", "Send LINE", "failed", "LINE user has blocked the official account"],
    ],
  },
  {
    round: 2,
    stage: "Shortlisted",
    decision: "shortlisted",
    score: 91,
    blockId: "b-completed-r2",
    currentNodeId: "n-r2-notify",
    runStatus: "completed",
    steps: [
      ["b-completed-r2", "Interview Completed", "success"],
      ["n-r2-note", "Create Note", "success"],
      ["n-r2-is", "Is: shortlist rule", "success"],
      ["n-r2-shortlist", "Update Decision: shortlisted", "success"],
      ["n-r2-notify", "Notify Team", "success"],
    ],
  },
  {
    round: 2,
    stage: "Recruiter review",
    decision: "pending",
    score: 76,
    blockId: "b-completed-r2",
    currentNodeId: "n-r2-stage",
    runStatus: "completed",
    steps: [
      ["b-completed-r2", "Interview Completed", "success"],
      ["n-r2-note", "Create Note", "success"],
      ["n-r2-is", "Is: shortlist rule", "success"],
      ["n-r2-stage", "Update Application Stage", "success"],
    ],
  },
]

const frontlineStates: StateTemplate[] = [
  {
    round: 1,
    stage: "Invited",
    decision: "pending",
    blockId: "b-fl-new",
    currentNodeId: "n-fl-wait",
    runStatus: "running",
    steps: [
      ["b-fl-new", "New Application", "success"],
      ["n-fl-outreach", "Initiate Outreach", "success"],
      ["n-fl-line", "Send LINE", "success"],
      ["n-fl-wait", "Wait 3 hours", "waiting"],
    ],
  },
  {
    round: 1,
    stage: "Shortlisted",
    decision: "shortlisted",
    score: 74,
    blockId: "b-fl-completed",
    currentNodeId: "n-fl-line-pass",
    runStatus: "completed",
    steps: [
      ["b-fl-completed", "Interview Completed", "success"],
      ["n-fl-is", "Is: score ≥ 60", "success"],
      ["n-fl-shortlist", "Update Decision: shortlisted", "success"],
      ["n-fl-line-pass", "Send LINE", "success"],
    ],
  },
  {
    round: 1,
    stage: "Rejected",
    decision: "rejected",
    score: 41,
    blockId: "b-fl-completed",
    currentNodeId: "n-fl-reject",
    runStatus: "completed",
    steps: [
      ["b-fl-completed", "Interview Completed", "success"],
      ["n-fl-is", "Is: score ≥ 60", "success"],
      ["n-fl-reject", "Update Decision: rejected", "success"],
    ],
  },
]

// Candidate index ranges per job (matches the `people` list above).
const assignments: { jobId: string; workflowId: string; from: number; to: number; states: StateTemplate[] }[] = [
  { jobId: "job-frontend", workflowId: "wf-standard", from: 0, to: 8, states: standardStates },
  { jobId: "job-recruiter", workflowId: "wf-standard", from: 8, to: 15, states: standardStates },
  { jobId: "job-store-staff", workflowId: "wf-frontline", from: 15, to: 24, states: frontlineStates },
  { jobId: "job-warehouse", workflowId: "wf-frontline", from: 24, to: 30, states: frontlineStates },
]

const sources: Application["source"][] = ["apply_link", "line", "crm", "matched", "manual"]
const start = Date.parse("2026-09-24T02:00:00Z")
const HOUR = 3_600_000

export const applications: Application[] = []
export const runs: WorkflowRun[] = []

for (const { jobId, workflowId, from, to, states } of assignments) {
  for (let i = from; i < to; i++) {
    const state = states[(i - from) % states.length]!
    const appliedAt = start + i * 5 * HOUR
    const id = `app-${String(i + 1).padStart(2, "0")}`

    applications.push({
      id,
      jobId,
      candidateId: candidates[i]!.id,
      round: state.round,
      stage: state.stage,
      decision: state.decision,
      score: state.score,
      source: sources[i % sources.length]!,
      appliedAt: new Date(appliedAt).toISOString(),
      lastActivityAt: new Date(appliedAt + state.steps.length * HOUR).toISOString(),
      currentNodeId: state.currentNodeId,
    })

    runs.push({
      id: `run-${String(i + 1).padStart(2, "0")}`,
      applicationId: id,
      workflowId,
      round: state.round,
      blockId: state.blockId,
      status: state.runStatus,
      steps: state.steps.map(([nodeId, label, status, error], s) => ({
        id: `${id}-step-${s + 1}`,
        nodeId,
        label,
        status,
        at: new Date(appliedAt + s * 12 * 60_000).toISOString(),
        error,
      })),
    })
  }
}
