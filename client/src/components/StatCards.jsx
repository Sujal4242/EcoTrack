import { Layers, Weight, TrendingUp } from "lucide-react";

export default function StatCards({ totalLogs, totalWeight, topCategory }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
                { icon: Layers, label: "Total Logs", value: totalLogs, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: Weight, label: "Total Weight", value: `${totalWeight.toFixed(1)} kg`, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { icon: TrendingUp, label: "Top Category", value: topCategory, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
                        <p className="text-white font-semibold text-lg leading-tight">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}