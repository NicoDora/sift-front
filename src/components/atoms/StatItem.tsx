interface StatItemProps {
  label: string;
  scoreLabel: string;
  color: string;
  value: number;
}

export const StatItem = ({
  label,
  scoreLabel,
  color,
  value,
}: StatItemProps) => (
  <div className="flex flex-col items-center bg-bodyButtonBoxBg p-2 rounded-lg">
    <span className="text-bodyText text-xs mb-1">{label}</span>
    <span className={`font-bold text-sm ${color}`}>{scoreLabel}</span>
    <span className="font-bold text-sm text-bodyText">{Math.floor(value)}</span>
  </div>
);
