import type { Block, OutreachSettings, SavedBlock, Workflow } from "./types"

const bangkokHours: OutreachSettings = {
  start: "09:00",
  end: "19:00",
  timezone: "Asia/Bangkok",
  intake: "on_invite",
}

// PRD §5 scenario A
const newApplicantBlock: Block = {
  id: "b-new-app",
  trigger: "new_application",
  steps: [
    {
      id: "n-is-qualified",
      kind: "utility",
      type: "is",
      config: {
        conditions: [
          [{ field: "resume_score", operator: "gte", value: 60 }],
          [{ field: "source", operator: "eq", value: "matched" }],
        ],
      },
      yes: [
        {
          id: "n-note-qualified",
          kind: "action",
          type: "create_note",
          config: { body: "Passed auto-screen. Invited to Round 1." },
        },
        {
          id: "n-outreach-r1",
          kind: "utility",
          type: "initiate_outreach",
          children: [
            {
              id: "n-line-invite",
              kind: "action",
              type: "send_line",
              config: {
                body: "สวัสดีค่ะ คุณ {{candidate.first_name}} ขอเชิญสัมภาษณ์ตำแหน่ง {{job.title}} {{interview.link}}",
              },
            },
            { id: "n-wait-1h", kind: "utility", type: "wait", config: { durationMinutes: 60 } },
            {
              id: "n-email-invite",
              kind: "action",
              type: "send_email",
              config: {
                recipient: "candidate",
                subject: "Your interview for {{job.title}}",
                body: "Hi {{candidate.first_name}}, please start your interview here: {{interview.link}}",
              },
            },
            { id: "n-wait-2h", kind: "utility", type: "wait", config: { durationMinutes: 120 } },
            {
              id: "n-sms-reminder",
              kind: "action",
              type: "send_sms",
              config: { body: "GetLinks: your {{job.title}} interview is waiting. {{interview.link}}" },
            },
          ],
        },
      ],
      no: [
        {
          id: "n-reject-unqualified",
          kind: "action",
          type: "update_decision",
          config: { value: "rejected" },
        },
        {
          id: "n-email-decline",
          kind: "action",
          type: "send_email",
          config: {
            recipient: "candidate",
            subject: "Your application to {{job.title}}",
            body: "Thank you for applying. We won't be moving forward this time.",
          },
        },
      ],
    },
  ],
}

// PRD §5 scenario B
const interviewCompletedBlock: Block = {
  id: "b-completed",
  trigger: "interview_completed",
  steps: [
    {
      id: "n-store-score",
      kind: "action",
      type: "update_field",
      config: { field: "application.score", value: "{{interview.score}}" },
    },
    {
      id: "n-note-report",
      kind: "action",
      type: "create_note",
      config: { body: "Interview report: {{interview.report_link}}" },
    },
    {
      id: "n-is-score",
      kind: "utility",
      type: "is",
      config: { conditions: [[{ field: "score", operator: "gt", value: 50 }]] },
      yes: [
        {
          id: "n-notify-pass",
          kind: "action",
          type: "notify_team",
          config: { recipient: "recruiter", body: "{{candidate.name}} passed Round 1." },
        },
        { id: "n-move-r2", kind: "utility", type: "move_to_round", config: { targetRound: 2 } },
      ],
      no: [
        {
          id: "n-line-decline",
          kind: "action",
          type: "send_line",
          config: { body: "ขอบคุณที่สละเวลาสัมภาษณ์ค่ะ ครั้งนี้ยังไม่ผ่านการคัดเลือก" },
        },
        { id: "n-reject", kind: "action", type: "update_decision", config: { value: "rejected" } },
      ],
    },
  ],
}

// PRD §5 scenario C
const interviewMissedBlock: Block = {
  id: "b-missed",
  trigger: "interview_missed",
  steps: [
    { id: "n-wait-1d", kind: "utility", type: "wait", config: { durationMinutes: 1440 } },
    {
      id: "n-outreach-resched",
      kind: "utility",
      type: "initiate_outreach",
      children: [
        {
          id: "n-line-resched",
          kind: "action",
          type: "send_line",
          config: { body: "พลาดนัดสัมภาษณ์ไปใช่ไหมคะ เลือกเวลาใหม่ได้ที่ {{interview.link}}" },
        },
        { id: "n-wait-1d-b", kind: "utility", type: "wait", config: { durationMinutes: 1440 } },
        {
          id: "n-email-resched",
          kind: "action",
          type: "send_email",
          config: {
            recipient: "candidate",
            subject: "Reschedule your interview",
            body: "Pick a new time here: {{interview.link}}",
          },
        },
      ],
    },
  ],
}

// PRD §5 scenario D
const decisionUpdatedBlock: Block = {
  id: "b-decision",
  trigger: "decision_updated",
  steps: [
    {
      id: "n-filter-sessions",
      kind: "utility",
      type: "filter",
      config: {
        entity: "application",
        conditions: [[{ field: "sessions", operator: "is_not_empty" }]],
      },
      yes: [
        {
          id: "n-notify-hm",
          kind: "action",
          type: "notify_team",
          config: { recipient: "hiring_manager", body: "Decision updated for {{candidate.name}}." },
        },
      ],
      no: [
        {
          id: "n-notify-flag",
          kind: "action",
          type: "notify_team",
          config: { recipient: "recruiter", body: "Decision set without an interview: {{candidate.name}}." },
        },
      ],
    },
  ],
}

const round2CompletedBlock: Block = {
  id: "b-completed-r2",
  trigger: "interview_completed",
  steps: [
    {
      id: "n-r2-note",
      kind: "action",
      type: "create_note",
      config: { body: "Technical round report: {{interview.report_link}}" },
    },
    {
      id: "n-r2-is",
      kind: "utility",
      type: "is",
      config: {
        conditions: [
          [
            { field: "score", operator: "gt", value: 80 },
            { field: "location", operator: "eq", value: "Bangkok" },
          ],
          [{ field: "score", operator: "gt", value: 90 }],
        ],
      },
      yes: [
        { id: "n-r2-shortlist", kind: "action", type: "update_decision", config: { value: "shortlisted" } },
        {
          id: "n-r2-notify",
          kind: "action",
          type: "notify_team",
          config: { recipient: "hiring_manager", body: "{{candidate.name}} is shortlisted." },
        },
      ],
      no: [
        {
          id: "n-r2-stage",
          kind: "action",
          type: "update_stage",
          config: { value: "Recruiter review" },
        },
      ],
    },
  ],
}

export const workflows: Workflow[] = [
  {
    id: "wf-standard",
    name: "Standard two-round hiring",
    description: "Auto-screen, LINE-first outreach, AI screening then AI technical round.",
    status: "published",
    version: 7,
    updatedAt: "2026-09-29T10:12:00+07:00",
    updatedBy: "Ploy Srisuk",
    settings: bangkokHours,
    rounds: [
      {
        index: 1,
        name: "Round 1",
        blocks: [newApplicantBlock, interviewCompletedBlock, interviewMissedBlock, decisionUpdatedBlock],
      },
      {
        index: 2,
        name: "Round 2",
        blocks: [round2CompletedBlock],
      },
    ],
  },
  {
    id: "wf-frontline",
    name: "Frontline fast track",
    description: "One short LINE interview and an instant decision for store and warehouse roles.",
    status: "published",
    version: 3,
    updatedAt: "2026-09-25T16:40:00+07:00",
    updatedBy: "Nattapong Chaiyasit",
    settings: { ...bangkokHours, start: "08:00", end: "20:00", intake: "on_engagement" },
    rounds: [
      {
        index: 1,
        name: "Round 1",
        blocks: [
          {
            id: "b-fl-new",
            trigger: "new_application",
            steps: [
              {
                id: "n-fl-outreach",
                kind: "utility",
                type: "initiate_outreach",
                children: [
                  {
                    id: "n-fl-line",
                    kind: "action",
                    type: "send_line",
                    config: { body: "สนใจงาน {{job.title}} ใช่ไหมคะ ตอบคำถามสั้น ๆ 3 ข้อได้เลย {{interview.link}}" },
                  },
                  { id: "n-fl-wait", kind: "utility", type: "wait", config: { durationMinutes: 180 } },
                  {
                    id: "n-fl-sms",
                    kind: "action",
                    type: "send_sms",
                    config: { body: "GetLinks: ทำแบบสัมภาษณ์งาน {{job.title}} {{interview.link}}" },
                  },
                ],
              },
            ],
          },
          {
            id: "b-fl-completed",
            trigger: "interview_completed",
            steps: [
              {
                id: "n-fl-is",
                kind: "utility",
                type: "is",
                config: { conditions: [[{ field: "score", operator: "gte", value: 60 }]] },
                yes: [
                  { id: "n-fl-shortlist", kind: "action", type: "update_decision", config: { value: "shortlisted" } },
                  {
                    id: "n-fl-line-pass",
                    kind: "action",
                    type: "send_line",
                    config: { body: "ผ่านรอบแรกแล้วค่ะ ทีมงานจะติดต่อนัดดูสาขา" },
                  },
                ],
                no: [
                  { id: "n-fl-reject", kind: "action", type: "update_decision", config: { value: "rejected" } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "wf-draft-referral",
    name: "Referral pipeline (draft)",
    description: "Manually invited referrals skip auto-screen.",
    status: "draft",
    version: 1,
    updatedAt: "2026-09-30T18:05:00+07:00",
    updatedBy: "Ploy Srisuk",
    settings: bangkokHours,
    rounds: [
      {
        index: 1,
        name: "Round 1",
        blocks: [
          {
            id: "b-ref-invited",
            trigger: "manually_invited",
            steps: [
              {
                id: "n-ref-note",
                kind: "action",
                type: "create_note",
                config: { body: "Referral: invited by {{user.name}}." },
              },
              {
                id: "n-ref-outreach",
                kind: "utility",
                type: "initiate_outreach",
                children: [
                  {
                    id: "n-ref-email",
                    kind: "action",
                    type: "send_email",
                    config: {
                      recipient: "candidate",
                      subject: "You've been referred for {{job.title}}",
                      body: "Start your interview here: {{interview.link}}",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const savedBlocks: SavedBlock[] = [
  {
    id: "sb-new-applicant",
    name: "New applicant: screen and invite",
    description: "Auto-screen, then LINE, email and SMS invitations.",
    premade: true,
    block: newApplicantBlock,
  },
  {
    id: "sb-completed",
    name: "Interview completed: score gate",
    description: "Store the score, then advance or decline.",
    premade: true,
    block: interviewCompletedBlock,
  },
  {
    id: "sb-missed",
    name: "Missed interview: reschedule",
    description: "Wait a day, then offer a new time.",
    premade: true,
    block: interviewMissedBlock,
  },
  {
    id: "sb-decision",
    name: "Decision updated: notify",
    description: "Tell the hiring manager, flag decisions without an interview.",
    premade: true,
    block: decisionUpdatedBlock,
  },
  {
    id: "sb-team-shortlist",
    name: "Our shortlist rule",
    description: "Saved by Ploy: Bangkok over 80, or anyone over 90.",
    premade: false,
    block: round2CompletedBlock,
  },
]
