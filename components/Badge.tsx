type BadgeProps = {
  children: React.ReactNode;
  tone?: "blue" | "green" | "purple" | "slate" | "amber";
};

const toneClassName = {
  blue: "border-blue-400/30 bg-blue-400/10 text-blue-100",
  green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  purple: "border-violet-400/30 bg-violet-400/10 text-violet-100",
  slate: "border-slate-600 bg-slate-800 text-slate-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-100"
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}
