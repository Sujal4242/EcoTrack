import { BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BADGE, CAT_COLORS } from "../constants";

export default function ChartsTab({ stats }) {
    if (!stats || stats.byCategory.length === 0) {
        return (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col items-center justify-center py-20">
                <BarChart2 className="w-10 h-10 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">Add logs to see analytics.</p>
            </div>
        );
    }

    const tooltipStyle = {
        contentStyle: { background: "#111827", border: "1px solid #1f2937", borderRadius: 12 },
        labelStyle: { color: "#f9fafb" },
    };

    return (
        <div className="space-y-6">
            {[
                { title: "Total Weight by Category (kg)", dataKey: "totalWeight", itemColor: "#10b981" },
                { title: "Number of Items by Category", dataKey: "count", itemColor: "#8b5cf6" },
            ].map(({ title, dataKey, itemColor }) => (
                <div key={title} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-base font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.byCategory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="_id" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => v.split(" ")[0]} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                            <Tooltip {...tooltipStyle} itemStyle={{ color: itemColor }} />
                            <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
                                {stats.byCategory.map((e) => <Cell key={e._id} fill={CAT_COLORS[e._id] ?? "#6b7280"} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Category Breakdown</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-widest">
                            {["Category", "Items", "Total Weight", "Avg Weight"].map((h) => (
                                <th key={h} className="px-6 py-3 text-left">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {stats.byCategory.map((row) => (
                            <tr key={row._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full border ${BADGE[row._id] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                                        {row._id}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-300">{row.count}</td>
                                <td className="px-6 py-3 text-gray-300">{row.totalWeight.toFixed(1)} kg</td>
                                <td className="px-6 py-3 text-gray-500">{(row.totalWeight / row.count).toFixed(1)} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}