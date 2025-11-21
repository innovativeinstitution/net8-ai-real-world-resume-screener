import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { createCandidate, listCandidates, Candidate } from "../lib/api";

export default function Candidates() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<Candidate[]>([]);

  const load = async () => {
    try {
      setErr(null);
      setRows(await listCandidates());
    } catch (e: any) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!fullName.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      await createCandidate({
        FullName: fullName.trim(),
        Email: email || null,
        Phone: phone || null,
        ResumeText: resumeText || null,
        ResumeUrl: resumeUrl || null
      });
      setFullName(""); setEmail(""); setPhone(""); setResumeText(""); setResumeUrl("");
      await load();
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageMeta title="Candidates" description="Manage candidates" />
      <PageBreadcrumb pageTitle="Candidates" />

      <div className="space-y-8">
        <ComponentCard title="Add Candidate">
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Alex Johnson" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="alex@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="555-111-2222" />
              </div>
            </div>
            <div>
              <Label htmlFor="resumeText">Resume Text</Label>
              <textarea
                id="resumeText"
                rows={8}
                value={resumeText}
                onChange={(e)=>setResumeText(e.target.value)}
                placeholder="Paste resume text here…"
                className="h-auto w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <Label htmlFor="resumeUrl">Resume URL (optional)</Label>
              <Input id="resumeUrl" type="url" value={resumeUrl} onChange={(e)=>setResumeUrl(e.target.value)} placeholder="https://…" />
            </div>

            {err && <div className="text-sm text-red-500">{err}</div>}

            <div className="flex gap-3">
              <button
                onClick={onCreate}
                disabled={loading}
                className="inline-flex h-11 items-center rounded-lg bg-brand-600 px-5 text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create Candidate"}
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

        <ComponentCard title="Candidates List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/10">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Phone</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Created</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                    {rows.map(c => (
                      <TableRow key={c.candidate_id}>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{c.full_name}</TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{c.email || "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{c.phone || "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                          {new Date(c.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell className="px-5 py-6 text-gray-500 dark:text-gray-400" colSpan={4}>
                          No candidates yet — add one above.
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
