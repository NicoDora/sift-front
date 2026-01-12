export interface SectorData {
  name: string;
  change: number;
}

export const getChangeColorClass = (change: number) => {
  if (change > 0)
    return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  if (change < 0)
    return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  return "text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
};
