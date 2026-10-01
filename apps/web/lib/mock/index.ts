import { applications, candidates, runs } from "./candidates"
import { guides } from "./guides"
import { history } from "./history"
import { jobs } from "./jobs"
import { workflows } from "./workflows"

export * from "./types"
export * from "./catalog"
export { applications, candidates, runs } from "./candidates"
export { guides } from "./guides"
export { history } from "./history"
export { currentUser, jobs, team } from "./jobs"
export { savedBlocks, workflows } from "./workflows"

export const getJob = (id: string) => jobs.find((j) => j.id === id)
export const getWorkflow = (id: string) => workflows.find((w) => w.id === id)
export const getGuide = (id: string) => guides.find((g) => g.id === id)
export const getCandidate = (id: string) => candidates.find((c) => c.id === id)
export const getApplication = (id: string) => applications.find((a) => a.id === id)

export const getApplicationsForJob = (jobId: string) =>
  applications.filter((a) => a.jobId === jobId)

export const getApplicationsForCandidate = (candidateId: string) =>
  applications.filter((a) => a.candidateId === candidateId)

export const getRunsForApplication = (applicationId: string) =>
  runs.filter((r) => r.applicationId === applicationId)

export const getJobsUsingWorkflow = (workflowId: string) =>
  jobs.filter((j) => j.workflowId === workflowId)

export const countJobsUsingWorkflow = (workflowId: string) =>
  getJobsUsingWorkflow(workflowId).length

export const getHistoryForWorkflow = (workflowId: string) =>
  history.filter((h) => h.workflowId === workflowId)
