// import { type LucideIcon } from "lucide-react";

// type CardPropsType = {
//     stats: { title: string; value: number; icon: LucideIcon, progress: string }[]
// };
// const StatsCard = ({ stats }: CardPropsType) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-10">
//       {stats.map((item, index) => (
//         <div className="flex items-center gap-4 bg-blue-100 p-4 rounded-md" key={index}>
//           <item.icon className="text-blue-500" />
//           <div className="w-full">
//             <p className="font-bold text-gray-600 text-sm">{item.title}</p>
//             <p className="font-bold text-lg">{item.value}</p>
//             <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100"
//                 style={{ width: `${item.progress}` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       ))}
      
//     </div>
//   );
// };

// export default StatsCard;

import { type LucideIcon } from "lucide-react";

type StatItem = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  progress: string;
  bg?: string;
  gradient?: string;
};

type StatsCardProps = {
  stats: StatItem[];
  cols?: { base?: number; md?: number; xl?: number }; // ✅ control grid size
};

const StatsCard = ({ stats, cols = { base: 1, md: 2, xl: 3 } }: StatsCardProps) => {
  // Dynamically build grid class
  const gridCols = `grid grid-cols-${cols.base} md:grid-cols-${cols.md} xl:grid-cols-${cols.xl} gap-6 mb-10`;

  return (
    <div className={gridCols}>
      {stats.map((item, index) => {
        const Icon = item.icon;
        const bgColor = item.bg ?? "bg-blue-100";
        const gradient =
          item.gradient ?? "bg-gradient-to-r from-blue-500 to-purple-600";

        return (
          <div
            key={index}
            className={`flex items-center gap-4 ${bgColor} p-4 rounded-xl shadow-sm hover:shadow-md transition`}
          >
            <Icon className="text-blue-600 h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-600 text-sm">{item.title}</p>
              <p className="font-bold text-xl">{item.value}</p>
              <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${gradient} rounded-full transition-all duration-300`}
                  style={{ width: item.progress }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;

