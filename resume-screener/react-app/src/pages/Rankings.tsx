import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { getRankings, listJobs, refreshRankings, Job, RankingsResponse } from "../lib/api";

export default function Rankings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState<string>("");
  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => setJobs(await listJobs()))();
  }, []);

  const onLoad = async () => {
    if (!jobId) return;
    setLoading(true); setErr(null);
    try {
      const r = await getRankings(jobId);
      setData(r);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => {
    if (!jobId) return;
    setLoading(true); setErr(null);
    try {
      await refreshRankings(jobId);
      // small wait for the worker to process (for tiny datasets this is enough)
      setTimeout(onLoad, 1500);
    } catch (e: any) { setErr(e.message); setLoading(false); }
  };

  const selectOptions = jobs.map(j => ({ value: j.job_id, label: j.title }));

  return (
    <div>
      <PageMeta title="Rankings" description="View ranked candidates" />
      <PageBreadcrumb pageTitle="Rankings" />

      <div className="space-y-8">
        <ComponentCard title="Select Job & Actions">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Job</Label>
              <Select
                options={selectOptions}
                placeholder="Select a job"
                value={jobId}
                onChange={(val: string) => setJobId(val)}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={onLoad}
                disabled={!jobId || loading}
                className="inline-flex h-11 items-center rounded-lg bg-brand-600 px-5 text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Loading…" : "Load Rankings"}
              </button>
              <button
                onClick={onRefresh}
                disabled={!jobId || loading}
                className="inline-flex h-11 items-center rounded-lg border border-gray-300 px-5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                {loading ? "Recalculating…" : "Recalculate"}
              </button>
            </div>
          </div>
          {err && <div className="mt-3 text-sm text-red-500">{err}</div>}
        </ComponentCard>

        <ComponentCard title="Ranked Candidates">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1100px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/10">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Candidate</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Score</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Justification</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                    {(data?.rankings || []).map(r => (
                      <TableRow key={r.candidateId}>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{r.fullName}</TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{r.email || "-"}</TableCell>
                        <TableCell className="px-5 py-4">
                          <Badge size="sm" color={r.score >= 0.75 ? "success" : r.score >= 0.5 ? "warning" : "error"}>
                            {r.score.toFixed(3)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {r.justification || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!data?.rankings?.length && (
                      <TableRow>
                        <TableCell className="px-5 py-6 text-gray-500 dark:text-gray-400" colSpan={4}>
                          {jobId ? "No rankings yet. Click Recalculate, then Load." : "Select a job to view rankings."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
