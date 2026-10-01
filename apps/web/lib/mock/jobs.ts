import type { Job, TeamMember } from "./types"

export const jobs: Job[] = [
  {
    id: "job-frontend",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Bangkok",
    status: "open",
    description: "Own the web experience of our hiring products. React, TypeScript, Next.js.",
    workflowId: "wf-standard",
    rounds: [
      { index: 1, name: "Screening", type: "ai", guideId: "guide-screening" },
      { index: 2, name: "Technical", type: "ai", guideId: "guide-frontend" },
    ],
    createdAt: "2026-09-10T09:00:00+07:00",
  },
  {
    id: "job-recruiter",
    title: "Talent Acquisition Specialist",
    department: "People",
    location: "Bangkok",
    status: "open",
    description: "Run full-cycle hiring for agency clients across Thailand.",
    workflowId: "wf-standard",
    rounds: [
      { index: 1, name: "Screening", type: "ai", guideId: "guide-screening" },
      { index: 2, name: "Deep dive", type: "ai", guideId: "guide-screening" },
    ],
    createdAt: "2026-09-18T11:30:00+07:00",
  },
  {
    id: "job-store-staff",
    title: "Store Staff (Sukhumvit branch)",
    department: "Retail",
    location: "Bangkok",
    status: "open",
    description: "Customer service and stock handling. Shift work, no experience required.",
    workflowId: "wf-frontline",
    rounds: [{ index: 1, name: "LINE interview", type: "ai", guideId: "guide-store-staff" }],
    createdAt: "2026-09-22T08:15:00+07:00",
  },
  {
    id: "job-warehouse",
    title: "Warehouse Associate",
    department: "Logistics",
    location: "Samut Prakan",
    status: "paused",
    description: "Picking, packing and inventory counts at the Bang Phli warehouse.",
    workflowId: "wf-frontline",
    rounds: [{ index: 1, name: "LINE interview", type: "ai", guideId: "guide-store-staff" }],
    createdAt: "2026-08-30T14:00:00+07:00",
  },
]

export const team: TeamMember[] = [
  { id: "u-ploy", name: "Ploy Srisuk", email: "ploy@getlinks.example", role: "admin" },
  { id: "u-nattapong", name: "Nattapong Chaiyasit", email: "nattapong@getlinks.example", role: "recruiter" },
  { id: "u-kanya", name: "Kanya Wongsakul", email: "kanya@getlinks.example", role: "recruiter" },
  { id: "u-anan", name: "Anan Rattanakorn", email: "anan@getlinks.example", role: "hiring_manager" },
]

export const currentUser = team[0]!
