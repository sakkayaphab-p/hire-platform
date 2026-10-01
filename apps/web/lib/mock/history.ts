import type { HistoryEntry } from "./types"

export const history: HistoryEntry[] = [
  {
    id: "h-7",
    workflowId: "wf-standard",
    version: 7,
    author: "Ploy Srisuk",
    at: "2026-09-29T10:12:00+07:00",
    summary: "Tightened the Round 2 shortlist rule",
    changes: [
      { kind: "changed", round: 2, target: "Is: shortlist rule", detail: "score > 75 → (score > 80 AND location = Bangkok) OR score > 90" },
      { kind: "added", round: 2, target: "Update Application Stage", detail: "No path now sets stage to “Recruiter review”" },
    ],
  },
  {
    id: "h-6",
    workflowId: "wf-standard",
    version: 6,
    author: "Nattapong Chaiyasit",
    at: "2026-09-26T15:48:00+07:00",
    summary: "Added a block for missed interviews",
    changes: [
      { kind: "added", round: 1, target: "Interview Missed", detail: "New block: Wait 1 day → Initiate Outreach" },
      { kind: "added", round: 1, target: "Send LINE", detail: "Reschedule message inside Initiate Outreach" },
      { kind: "added", round: 1, target: "Send Email", detail: "Reschedule email after 1 day" },
    ],
  },
  {
    id: "h-5",
    workflowId: "wf-standard",
    version: 5,
    author: "Ploy Srisuk",
    at: "2026-09-22T09:30:00+07:00",
    summary: "LINE first, SMS last",
    changes: [
      { kind: "changed", round: 1, target: "Initiate Outreach", detail: "Reordered: LINE → wait 1h → Email → wait 2h → SMS" },
      { kind: "removed", round: 1, target: "Send Email", detail: "Removed the duplicate invitation email outside the group" },
    ],
  },
  {
    id: "h-fl-3",
    workflowId: "wf-frontline",
    version: 3,
    author: "Nattapong Chaiyasit",
    at: "2026-09-25T16:40:00+07:00",
    summary: "Lowered the pass score for frontline roles",
    changes: [
      { kind: "changed", round: 1, target: "Is: score", detail: "score ≥ 70 → score ≥ 60" },
    ],
  },
  {
    id: "h-ref-1",
    workflowId: "wf-draft-referral",
    version: 1,
    author: "Ploy Srisuk",
    at: "2026-09-30T18:05:00+07:00",
    summary: "Created the workflow",
    changes: [
      { kind: "added", round: 1, target: "Manually Invited", detail: "New block: Create Note → Initiate Outreach" },
    ],
  },
]
