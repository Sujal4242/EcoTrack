import { Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BADGE, CAT_COLORS, CO2_FACTORS, TREE_FACTOR } from "../constants";

export default function ImpactTab({ co2Data, stats }) {
    if (co2Data.totalCO2 === 0) {
        return (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col items-center justify-center py-20">
                <Leaf className="w-10 h-10 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">Add logs to see your CO₂ impact.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-emerald-900/40 via-gray-900 to-gray-900 border border-emerald-800/40 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-32 translate-x-32" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Environmental Impact</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {co2Data.totalCO2.toLocaleString()} kg
                    </h2>
                    <p className="text-emerald-300 text-lg">of CO₂ emissions prevented by your organisation</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Based on {stats?.totalItems ?? 0} disposal records totalling {(stats?.totalWeight ?? 0).toFixed(1)} kg
                    </p>
                </div>
            </div>

            {/* 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { emoji: "🌍", value: `${co2Data.totalCO2.toLocaleString()} kg`, label: "CO₂ Prevented", sub: "Carbon emissions avoided", color: "border-emerald-500/20 bg-emerald-500/5", text: "text-emerald-400" },
                    { emoji: "🌳", value: co2Data.trees.toLocaleString(), label: "Trees Equivalent", sub: "Annual CO₂ absorption of trees", color: "border-green-500/20 bg-green-500/5", text: "text-green-400" },
                    { emoji: "⚡", value: `${co2Data.kwh.toLocaleString()} kWh`, label: "Energy Equivalent", sub: "Electricity generation offset", color: "border-yellow-500/20 bg-yellow-500/5", text: "text-yellow-400" },
                ].map(({ emoji, value, label, sub, color, text }) => (
                    <div key={label} className={`rounded-2xl border p-6 ${color}`}>
                        <div className="text-3xl mb-3">{emoji}</div>
                        <p className={`text-2xl font-bold ${text} mb-1`} style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
                        <p className="text-white text-sm font-medium">{label}</p>
                        <p className="text-gray-500 text-xs mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-base font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>CO₂ Saved by Category</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={co2Data.byCategory} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => v.split(" ")[0]} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => `${v}kg`} />
                        <Tooltip
                            contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12 }}
                            labelStyle={{ color: "#f9fafb", fontSize: 12 }}
                            formatter={(v) => [`${v} kg CO₂`, "CO₂ Saved"]}
                        />
                        <Bar dataKey="co2Saved" radius={[6, 6, 0, 0]}>
                            {co2Data.byCategory.map((e) => <Cell key={e.category} fill={CAT_COLORS[e.category] ?? "#10b981"} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Impact Breakdown</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-widest">
                            {["Category", "Weight Recycled", "CO₂ Factor", "CO₂ Saved", "Trees Equiv."].map((h) => (
                                <th key={h} className="px-6 py-3 text-left">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...co2Data.byCategory].sort((a, b) => b.co2Saved - a.co2Saved).map((row) => (
                            <tr key={row.category} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full border ${BADGE[row.category] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                                        {row.category}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-300">{row.totalWeight.toFixed(1)} kg</td>
                                <td className="px-6 py-3 text-gray-500">×{CO2_FACTORS[row.category] ?? 16} kg CO₂/kg</td>
                                <td className="px-6 py-3"><span className="text-emerald-400 font-semibold">{row.co2Saved.toLocaleString()} kg</span></td>
                                <td className="px-6 py-3 text-gray-400">🌳 {Math.floor(row.co2Saved / TREE_FACTOR)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-emerald-500/5 border-t border-emerald-500/20">
                            <td className="px-6 py-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">Total</td>
                            <td className="px-6 py-3 text-white font-semibold">{(stats?.totalWeight ?? 0).toFixed(1)} kg</td>
                            <td className="px-6 py-3 text-gray-600">—</td>
                            <td className="px-6 py-3"><span className="text-emerald-400 font-bold">{co2Data.totalCO2.toLocaleString()} kg</span></td>
                            <td className="px-6 py-3 text-white font-semibold">🌳 {co2Data.trees.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="bg-gray-800/30 border border-gray-800 rounded-2xl px-6 py-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="text-gray-400 font-semibold">Methodology: </span>
                    CO₂ savings estimated using EPA and MoEF lifecycle assessment data.
                    Tree equivalence: 21 kg CO₂/tree/year. Energy: 0.82 kg CO₂/kWh.
                </p>
            </div>
        </div>
    );
}