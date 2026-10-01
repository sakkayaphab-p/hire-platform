# PRD: Application Workflows

| | |
|---|---|
| Product | GetLinks Hire Platform |
| Feature | Application workflows (visual candidate-journey automation) |
| Status | Draft v0.1 — 2026-10-01 |
| Reference | Modelled on Alex's workflow docs (docs.alex.com/workflows/*). Structure and mechanics are mocked; wording is original. |
| Related research | `newproject/research/alex-platform-teardown.md`, `ranked-ideas.md` (outside this repo, in the getlinks workspace) |

## 1. Overview

Hiring teams repeat the same moves for every applicant: invite them, chase them, score them, move
them to the next stage, tell the recruiter, tell the candidate. Application workflows let a team
define those moves once as a visual, drag-and-drop flow, and have the platform run it for every
candidate on a job. The team always knows what the platform did and why.

The platform is **Thai-first and LINE-native**: LINE is a first-class outreach channel next to email
and SMS, and the UI supports Thai and English.

### Goals

- A recruiter with no engineering help can build, edit and reuse a candidate workflow.
- Every job has exactly one workflow; every candidate's path through it is visible and auditable.
- Outreach reaches candidates on LINE, email and SMS, respects quiet hours, and stops when the
  candidate responds.
- Decisions (advance, reject, shortlist) can be automated with explicit, inspectable rules.

### Non-goals for v1

- **No external ATS sync.** No ATS-write actions and no ATS-linked triggers. Jobs, candidates and
  applications live natively in the platform (GetLinks CRM import is a later integration).
- **No job workflows.** Jobs are created in the platform; there is no automated import/configuration
  pipeline. Rounds and guides are set up per job (or from a template) by a user.
- **No phone-call action.** Voice outreach and voice interviews are deferred.
- No custom code actions; extension is via the webhook trigger and webhook request action.

## 2. Personas

| Persona | Needs |
|---|---|
| Recruiter | Builds and tunes workflows, watches candidates move, intervenes manually. |
| Hiring manager | Receives shortlists and scheduling requests; makes human-round decisions. |
| Candidate | Receives timely, polite messages on a channel they use; can reply, schedule, and interview at their own time. |
| Admin | Owns outreach hours, channel credentials, audit and access. |

### Key user stories

1. As a recruiter, I build a workflow for a job by dropping triggers and actions on a canvas.
2. As a recruiter, I start from a pre-made block and customize it instead of starting blank.
3. As a recruiter, I save a block I like and reuse it in other workflows.
4. As a recruiter, I see how many candidates sit at each step and click one to see their timeline.
5. As a recruiter, I review who changed a workflow, when, and exactly what changed.
6. As an admin, I set quiet hours so candidates are never messaged at night.
7. As a candidate, I get an invitation on LINE, and the reminders stop once I reply.

## 3. Concepts

| Term | Meaning |
|---|---|
| Job | A role being hired for. Has one workflow and one or more rounds. |
| Application | One candidate's application to one job. The unit a workflow runs for. |
| Round | One stage of the interview process (e.g. Screening, Technical, Final). |
| Workflow | The automation attached to a job; organized by rounds. |
| Block | One trigger followed by an ordered list of steps. The unit of automation. |
| Trigger | The event that starts a block. |
| Action | A step the platform performs (send a message, update a field...). |
| Utility | A step that controls flow (wait, branch, move round, outreach group). |
| Interview guide | The reusable definition of an AI interview: intro, questions, outro, evaluation criteria. |
| Decision | The outcome state of an application (e.g. pending, shortlisted, rejected). |
| Run | One execution of a block for one application, recorded step by step. |

## 4. Functional requirements

### 4.1 Workflow model

- **FR-1** A job has exactly one workflow. A workflow may be shared by many jobs.
- **FR-2** A workflow is organized by rounds; the editor shows one tab per round.
- **FR-3** Each round holds blocks. A block begins with exactly one trigger, then actions that run
  sequentially, top to bottom.
- **FR-4** Within one round, a trigger type may be used by at most one block. The same trigger type
  may appear in different rounds with different actions.
- **FR-5** Editing a shared workflow affects every job using it; the UI warns and shows the job count.
- **FR-6** A job's workflow can be switched to another workflow; in-flight applications keep running
  on the version they started with until they next hit a trigger (see 7.4).

### 4.2 Triggers

| Trigger | Fires when |
|---|---|
| New Application | A candidate applies or is added to the job |
| Candidate Matched | The platform matches a candidate to the job through search/match |
| Manually Invited | A user invites a candidate from the dashboard |
| Interview Scheduled | The candidate books an interview slot |
| Interview Started | The candidate starts the interview |
| Interview Completed | The candidate finishes the interview |
| Interview Incomplete | The candidate starts but does not finish |
| Interview Missed | The candidate does not show for a scheduled interview |
| Decision Updated | The application's decision changes (shortlisted, rejected, ...) |
| Webhook Received | An external system calls the workflow's webhook URL |

### 4.3 Actions

| Action | Behavior |
|---|---|
| Send Email | Email to the candidate, recruiter or other recipients, from a template with variables |
| Send SMS | Text message to the candidate |
| **Send LINE** | LINE message to the candidate (new vs. the reference; replaces phone call in v1) |
| Create Note | Add an internal note to the application |
| Update Application Stage | Set the application's pipeline stage |
| Update Decision | Set the decision (shortlist, reject, ...) |
| Update Field | Set a field or custom field on the candidate or application |
| Notify Team | In-app/email notification to a recruiter or hiring manager |
| Webhook Request | Send an HTTP request to an external endpoint |

### 4.4 Utilities

| Utility | Behavior |
|---|---|
| **Initiate Outreach** | A group container for a round's outreach. Holds an ordered sequence of Send Email / Send SMS / Send LINE / Wait steps. On an AI round it invites the candidate to the interview; on a human round it sends a scheduling link. Any invitation message must live inside this group. Runs until the candidate responds, schedules or interviews, then remaining steps are cancelled (see 7.2). |
| Move to Round | Moves the application to another round. Put notifications, updates and conditions before it in the block. |
| Wait | Pauses the block for a set duration before the next step. |
| Is | Branches (Yes/No) on the platform's own fields: score, name, location, decision, source, etc. |
| Filter | Branches (Yes/No) on the candidate, the job, or the application (including its interview sessions, e.g. "sessions is empty" to detect never-interviewed applications). |

### 4.5 Condition logic

- A condition is a list of **sets**. Inside a set, every statement must be true (AND). The branch is
  "Yes" if **any** set is true (OR).
- Example: `(score > 80 AND location = Bangkok) OR (score > 90)`.
- Each statement is `field` `operator` `value`; operators depend on field type (number, text, enum,
  date, list-empty).
- Every Is/Filter node has a Yes and a No path; either path may be empty.

### 4.6 Rounds and interview guides

- **FR-7** A job has at least one round and no maximum.
- **FR-8** A round is either an **AI interview round** or a **human round**.
- **FR-9** AI round: attaches one interview guide (intro, questions, outro, evaluation criteria,
  question limit). Guides are reusable across rounds and jobs: generic, role-specific or job-specific.
- **FR-10** Human round: one or more interviewers and a duration. The candidate sees combined
  availability; when several interviewers are free at the chosen slot, one is picked round-robin.
  *Human rounds require the scheduling capability; ship in a later phase (see 9).*
- **FR-11** How candidates move between rounds is defined only by the workflow (Move to Round,
  conditions, outreach), never by implicit rules.

### 4.7 Builder UX

- **FR-12** Three tabs: **Editor**, **History**, **Settings**.
- **FR-13** Editor: canvas plus left sidebar with a **Nodes** tab (triggers, actions, utilities, to
  drag onto the canvas) and a **Blocks** tab (pre-made blocks and the user's saved blocks).
- **FR-14** Drag a node onto a block and connect it below another; reorder by dragging; delete.
- **FR-15** Selecting a node opens a configuration panel (template editor with variables for
  messages, condition builder for Is/Filter, duration for Wait).
- **FR-16** Validation before save/publish: every block has one trigger; one block per trigger per
  round; invitation messages are inside Initiate Outreach; no unreachable nodes; required fields set.
- **FR-17** Pre-made blocks ship for common patterns (see section 5). Users can save any block for
  reuse; saved blocks are copies, not live links.
- **FR-18** Draft vs published: edits are saved as a draft; publishing creates a new version.

### 4.8 Workflow settings

- **FR-19** **Outreach hours**: a daily window and timezone (default Asia/Bangkok). Outbound
  messages are held until the window opens. This applies to all channels in all rounds.
- **FR-20** **Candidate intake**: how candidates who arrive directly (e.g. via a public apply link or
  LINE) are turned into applications, and when the application record is created: on invite, on first
  engagement, or after the interview completes.

### 4.9 Tracking and history

- **FR-21** Each job has a read-only **Workflow tab** that shows the workflow with a live count badge
  on every trigger and action (how many applications are currently there). Used to spot bottlenecks.
- **FR-22** Candidate search within the tab; clicking a candidate opens a **progress panel**: contact
  and status, the current step and how long they've been on it, and a timeline of every step with a
  timestamp and a green (success) / red (failed) indicator.
- **FR-23** From that tab a user can switch the job's workflow or open the editor (with the shared-
  workflow warning from FR-5).
- **FR-24** Workflow **History** is an audit log of every change: who, when, and what, with
  added/removed/changed items colour-coded (green/red/blue) and a visual diff on the canvas.
  Per-round history for multi-round workflows.

## 5. Example workflows (acceptance scenarios)

**A. New applicant → LINE screening invite**
`New Application` → `Is` (score or required field present) → Yes: `Create Note`, then
`Initiate Outreach` [Send LINE invite → Wait 1h → Send Email → Wait 2h → Send SMS reminder]. No:
`Update Decision` = rejected, `Send Email` (polite decline).

**B. Interview completed → decide and notify**
`Interview Completed` → `Update Field` (store score) → `Create Note` (report link) → `Is` (score
> 50) → Yes: `Notify Team`, `Move to Round` (Round 2) with `Initiate Outreach`. No: `Send LINE`
(decline) + `Update Decision` = rejected.

**C. Missed interview**
`Interview Missed` → `Wait 1 day` → `Initiate Outreach` [Send LINE reschedule link → Wait 1 day →
Send Email].

**D. Manual decision hand-off**
`Decision Updated` → `Filter` (application has interview sessions) → Yes: `Notify Team` hiring
manager. No: `Notify Team` recruiter with "decision without interview" flag.

Each scenario must be buildable in the editor, pass validation, and produce the expected timeline.

## 6. Data model (conceptual)

Not a schema commitment; names are indicative.

- `Workflow` (id, name, org, current_version_id)
- `WorkflowVersion` (id, workflow_id, graph JSON, published_at, author) — also backs History
- `Round` (id, workflow or job, order, type: ai | human, guide_id, interviewers, duration)
- `Block` / `Node` (id, round_id, kind: trigger | action | utility, type, config JSON, position,
  next/yes/no edges)
- `SavedBlock` (id, org, name, graph JSON)
- `InterviewGuide` (id, org, intro, questions, outro, criteria, limits)
- `Job` (id, workflow_id, ...), `Application` (id, job_id, candidate_id, round_id, decision, stage)
- `WorkflowRun` (id, application_id, block_id, version_id, status) and `StepExecution` (run_id,
  node_id, started_at, finished_at, status: success | failed | cancelled | waiting, error)
- `OutreachSettings` (workflow_id, window start/end, timezone) and `OutreachMessage` (channel,
  status, provider id)

## 7. Execution semantics

1. **Event → block.** An event for an application finds the block in the application's *current
   round* whose trigger matches, and starts a run.
2. **Sequential.** Steps run in order; a step is recorded as a `StepExecution`. Branch nodes follow
   Yes/No. A failed step marks the run failed, shows red in the timeline, and does not silently skip
   ahead; retriable errors (provider timeouts) retry with backoff before failing.
3. **Waits** are durable (survive restarts and deploys) and resume at the right time.
4. **Versioning.** A run executes on the version published when it started. A new version applies to
   new runs; in-flight runs finish on their original version.
5. **Outreach hours.** Sends scheduled outside the window are deferred to the next window open;
   Wait durations count real time, but sends fall into the window.
6. **Outreach cancellation.** Inside Initiate Outreach, a candidate reply, a scheduled interview or
   a started interview cancels the remaining outreach steps of that group (shown as cancelled).
7. **Idempotency.** A trigger event is processed at most once per (application, trigger, round,
   event id); duplicate webhooks and retries do not double-send.
8. **Round gating.** Triggers only match blocks in the application's current round; Move to Round
   changes the current round.

## 8. Non-functional requirements

- **Audit:** all workflow edits and all step executions are retained and queryable.
- **Privacy/PDPA:** candidate data and message content follow PDPA; consent for LINE/SMS/email is
  recorded; unsubscribe/opt-out is honored and stops outreach.
- **Compliance:** outreach hours enforced server-side, not only in the UI.
- **Reliability:** message sends are idempotent; waits are durable; duplicate events are safe.
- **Performance:** canvas stays responsive at 100+ nodes; count badges update within seconds.
- **i18n:** Thai and English UI; message templates are per-language; dates in the workflow's timezone.
- **Accessibility:** builder operable by keyboard (add, connect, reorder, delete nodes).

## 9. Phasing

| Phase | Scope |
|---|---|
| MVP | Native jobs/applications; rounds (AI type only); blocks with triggers New Application, Manually Invited, Interview Completed, Decision Updated; actions Send Email/LINE/SMS, Create Note, Update Decision, Update Application Stage, Update Field; utilities Initiate Outreach, Move to Round, Wait, Is; builder Editor + Settings (outreach hours); job Workflow tab with count badges and candidate timeline; History log. |
| v2 | Remaining triggers (Scheduled/Started/Incomplete/Missed, Candidate Matched, Webhook Received); Filter nodes; Webhook Request and Notify Team; pre-made + saved blocks; History visual diff; shared-workflow warnings; interview guides library. |
| v3 | Human rounds with scheduling and interviewer round-robin; candidate intake/link timing; Thai voice interview channel. |
| Later | GetLinks CRM import, ATS integrations, job workflows (automated import/config), phone-call action, custom actions. |

### Success metrics

- Time for a recruiter to build a working workflow from a pre-made block (target < 15 min).
- Share of jobs with a published workflow.
- Invite-to-schedule rate by channel (LINE vs email vs SMS).
- Candidates stuck at one step longer than expected (should fall as teams use badges).
- Failed-step rate per workflow run.

## 10. Open questions

1. Message providers: LINE Official Account / Messaging API model, SMS gateway, email service — which
   and what are the cost per message limits for LINE push?
2. Who triggers "Interview Completed" in v1 — an in-product AI interview, or a recruiter marking it
   manually until the interview feature ships?
3. Do we need workflow-level approval (publish review) for larger teams?
4. Is Thai/English message templating per workflow or per org?
5. What opt-in is required to message candidates on LINE who applied by another channel?
6. Execution engine: build on a durable-workflow runtime vs. a job queue plus scheduler table.

## 11. Mapping: reference feature → v1 treatment

| Reference (Alex docs) | Treatment | Notes |
|---|---|---|
| Application workflows, rounds, blocks, one trigger per round | **Kept** | FR-1..4 |
| Job workflows (ATS job import) | **Deferred** | needs ATS/CRM import |
| New Application, Interview Scheduled/Started/Completed/Missed/Incomplete, Manually Invited, Decision Updated, Webhook Received | **Kept** (phased) | 4.2, 9 |
| Candidate Matched | **Kept** (v2) | needs match feature |
| ATS-specific triggers | **Dropped** | no ATS in v1 |
| Send Email, Send SMS | **Kept** | |
| Phone Call | **Changed → Send LINE** | voice deferred |
| ATS sync actions (notes, stage, fields, file upload) | **Changed** | native Create Note, Update Stage, Update Field; file upload deferred |
| Configure Job, API Request (job workflow actions) | **Deferred** | job workflows out of scope; Webhook Request covers generic HTTP |
| Initiate Outreach group, Move to Round, Wait | **Kept** | |
| Is, Filter by candidate/job/application | **Kept** | Filters query native data, not an ATS |
| Filter By Application (Alex) with sessions | **Kept** (as Filter on application sessions) | |
| AI interview round + interview guide | **Kept** | |
| Human round + note-taker | **Deferred** | v3 |
| Builder tabs Editor / History / Settings; Nodes / Blocks sidebar | **Kept** | |
| Pre-made and saved blocks | **Kept** (v2) | |
| Outreach hours | **Kept** | default Asia/Bangkok |
| ATS Link (link candidate, create application timing) | **Changed → candidate intake** | native; v3 |
| Job Workflow tab with counts, candidate timeline | **Kept** | |
| History audit log with diff | **Kept** | diff view in v2 |
| Custom actions via support | **Deferred** | webhook trigger/request instead |
