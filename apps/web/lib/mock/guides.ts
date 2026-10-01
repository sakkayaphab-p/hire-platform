import type { InterviewGuide } from "./types"

export const guides: InterviewGuide[] = [
  {
    id: "guide-screening",
    name: "General screening",
    kind: "generic",
    language: "th",
    intro:
      "Hi {{candidate.first_name}}, thanks for applying to {{job.title}}. This is a short screening chat of about 10 minutes.",
    questions: [
      { id: "q1", text: "Tell me briefly about your current role.", criteria: "Clear, relevant summary" },
      { id: "q2", text: "Why are you interested in this position?", criteria: "Specific motivation" },
      { id: "q3", text: "What is your expected salary range?" },
      { id: "q4", text: "When could you start?" },
      { id: "q5", text: "Are you able to work on site in Bangkok?" },
    ],
    outro: "Thank you. Our team will get back to you within three working days.",
    criteria: ["Communication", "Motivation", "Availability", "Salary fit"],
    questionLimit: 5,
  },
  {
    id: "guide-frontend",
    name: "Frontend engineer technical",
    kind: "role",
    language: "en",
    intro:
      "Welcome to the technical round for {{job.title}}. I'll ask about React, TypeScript and how you ship UI.",
    questions: [
      { id: "q1", text: "How do you decide between server and client components?", criteria: "Understands trade-offs" },
      { id: "q2", text: "Describe a performance problem you fixed in a web app.", criteria: "Concrete, measured" },
      { id: "q3", text: "How do you keep a component library consistent across teams?" },
      { id: "q4", text: "Walk me through how you test a complex form.", criteria: "Covers edge cases" },
    ],
    outro: "That's all from me. You'll hear about next steps soon.",
    criteria: ["React depth", "TypeScript", "Performance", "Testing"],
    questionLimit: 6,
  },
  {
    id: "guide-store-staff",
    name: "Store staff (frontline)",
    kind: "role",
    language: "th",
    intro:
      "Hello {{candidate.first_name}}. A few quick questions about shifts and experience for {{job.title}}.",
    questions: [
      { id: "q1", text: "Which shifts can you work: morning, evening or night?" },
      { id: "q2", text: "Have you worked in retail or food service before?", criteria: "Any customer-facing experience" },
      { id: "q3", text: "How would you handle an unhappy customer?", criteria: "Calm, service-minded" },
    ],
    outro: "Thanks. If you pass, we'll send a LINE message to book a store visit.",
    criteria: ["Shift availability", "Service attitude", "Experience"],
    questionLimit: 4,
  },
]
