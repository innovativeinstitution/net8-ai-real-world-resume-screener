import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { createJob, listJobs, Job } from "../lib/api";

export default function Jobs() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const load = async () => {
    try {
      setErr(null);
      const data = await listJobs();
      setJobs(data);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!title.trim() || !desc.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      await createJob(title.trim(), desc.trim());
      setTitle(""); setDesc("");
      await load();
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageMeta title="Jobs" description="Manage job descriptions" />
      <PageBreadcrumb pageTitle="Jobs" />

      <div className="space-y-8">
        <ComponentCard title="Create Job">
          <div className="space-y-6">
            <div>
              <Label htmlFor="job-title">Title</Label>
              <Input id="job-title" type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Senior Backend Engineer" />
            </div>

            <div>
              <Label htmlFor="job-desc">Description</Label>
              <textarea
                id="job-desc"
                rows={8}
                value={desc}
                onChange={(e)=>setDesc(e.target.value)}
                placeholder="C#, .NET 8, PostgreSQL, RabbitMQ, vector search (pgvector), cloud experience..."
                className="h-auto w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            {err && <div className="text-sm text-red-500">{err}</div>}

            <div className="flex gap-3">
              <button
                onClick={onCreate}
                disabled={loading}
                className="inline-flex h-11 items-center rounded-lg bg-brand-600 px-5 text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create Job"}
              </button>
              <button
                onClick={load}
                className="inline-flex h-11 items-center rounded-lg border border-gray-300 px-5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Refresh
              </button>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Jobs List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/10">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Title</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Created</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                    {jobs.map(j => (
                      <TableRow key={j.job_id}>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{j.title}</TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                          {new Date(j.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {jobs.length === 0 && (
                      <TableRow>
                        <TableCell className="px-5 py-6 text-gray-500 dark:text-gray-400" colSpan={2}>
                          No jobs yet — add one above.
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
