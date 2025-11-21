const CORE_API = import.meta.env.VITE_CORE_API || "http://localhost:8080";

export type Job = {
  job_id: string;
  title: string;
  description: string;
  created_at: string;
};

export type Candidate = {
  candidate_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
};

export type RankingRow = {
  candidateId: string;
  fullName: string;
  email?: string | null;
  score: number;
  justification?: string | null;
};

export type RankingsResponse = {
  jobId: string;
  rankings: RankingRow[];
};

/** NEW: metrics types */
export type Metrics = {
  candidates: number;
  jobs: number;
  rankings: number;
};

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export const listJobs = () => api<Job[]>("/jobs");
export const createJob = (title: string, description: string) =>
  api<{ jobId: string; title: string; description: string }>("/jobs", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });

export const listCandidates = () => api<Candidate[]>("/candidates");
export const createCandidate = (payload: {
  FullName: string;
  Email?: string | null;
  Phone?: string | null;
  ResumeText?: string | null;
  ResumeUrl?: string | null;
}) =>
  api<{ candidateId: string }>("/candidates", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getRankings = (jobId: string) =>
  api<RankingsResponse>(`/rankings/${jobId}`);
export const refreshRankings = (jobId: string) =>
  api<{ status: string }>(`/rankings/${jobId}/refresh`, { method: "POST" });

/** NEW: fetch live counts */
export const getMetrics = () => api<Metrics>("/metrics");
