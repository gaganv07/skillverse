import { getProjectStatusMeta } from "../../lib/workflow";

export function ApprovalStatusBadge({ status, compact = false }) {
  const meta = getProjectStatusMeta(status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {compact ? meta.shortLabel : meta.label}
    </span>
  );
}
