import { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon, PaperPlaneIcon } from "../../icons";
import { getMetrics, Metrics } from "../../lib/api";

export default function ResumeScreenerMetrics() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const m = await getMetrics();
        if (mounted) setData(m);
      } catch (e: any) {
        if (mounted) setErr(e.message || "Failed to load metrics");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "—");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Candidates */}
      <MetricCard
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        label="Candidates"
        value={loading ? "…" : err ? "—" : fmt(data?.candidates)}
      />
      {/* Jobs */}
      <MetricCard
        icon={<BoxIconLine className="size-6 text-gray-800 dark:text-white/90" />}
        label="Jobs"
        value={loading ? "…" : err ? "—" : fmt(data?.jobs)}
      />
      {/* Rankings */}
      <MetricCard
        icon={<PaperPlaneIcon className="size-6 text-gray-800 dark:text-white/90" />}
        label="Rankings"
        value={loading ? "…" : err ? "—" : fmt(data?.rankings)}
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}
