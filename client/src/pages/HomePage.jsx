import {
    Recycle, Plus, BarChart2, Leaf, FileDown,
    TrendingUp, Clock, CheckCircle, ArrowRight,
    Layers, Weight, AlertTriangle,
} from "lucide-react";

export default function HomePage({ logs, stats, co2Data, onAddLog, onViewLogs, onViewAnalytics, onViewImpact, onExport }) {
    const totalWeight = stats?.totalWeight ?? 0;
    const topCategory = stats?.byCategory?.[0]?._id ?? "—";
    const closedLogs = logs.filter((l) => l.status === "Closed").length;
    const pendingLogs = logs.filter((l) => l.status !== "Closed" && l.status !== "Certificate Received").length;
    const complianceScore = logs.length === 0 ? 0 : Math.round((closedLogs / logs.length) * 100);

    const recentLogs = [...logs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const STATUS_COLOR = {
        "Logged": "text-gray-400",
        "Pickup Scheduled": "text-blue-400",
        "Picked Up": "text-amber-400",
        "Certificate Received": "text-violet-400",
        "Closed": "text-emerald-400",
    };

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-br from-emerald-900/30 via-gray-900 to-gray-950 border border-emerald-800/30 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full -translate-y-40 translate-x-40" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/3 rounded-full translate-y-24 -translate-x-24" />
                <div className="relative flex items-center justify-between gap-6 flex-wrap">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <Recycle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">
                                EcoTrack Dashboard
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2"
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            Welcome back! 👋
                        </h1>
                        <p className="text-gray-400 text-sm max-w-md">
                            Your organisation has responsibly recycled
                            <span className="text-emerald-400 font-semibold"> {totalWeight.toFixed(1)} kg </span>
                            of e-waste, preventing
                            <span className="text-emerald-400 font-semibold"> {co2Data.totalCO2.toLocaleString()} kg </span>
                            of CO₂ emissions.
                        </p>
                    </div>
                    <button onClick={onAddLog}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/25 flex-shrink-0">
                        <Plus className="w-5 h-5" /> Log New Waste
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: Layers, label: "Total Logs", value: logs.length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                    { icon: Weight, label: "Total Weight", value: `${totalWeight.toFixed(1)} kg`, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                    { icon: Leaf, label: "CO₂ Prevented", value: `${co2Data.totalCO2} kg`, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                    { icon: TrendingUp, label: "Trees Equivalent", value: `🌳 ${co2Data.trees}`, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${bg}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
                        <p className="text-white font-bold text-xl mt-1">{value}</p>
                    </div>
                ))}
            </div>

            {/* Compliance + Pending */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Compliance Score */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                strokeDasharray={`${complianceScore} ${100 - complianceScore}`}
                                strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">{complianceScore}%</span>
                        </div>
                    </div>
                    <p className="text-white font-semibold">Compliance Score</p>
                    <p className="text-gray-500 text-xs mt-1">{closedLogs} of {logs.length} logs closed</p>
                </div>

                {/* Pending Items */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <p className="text-sm font-semibold text-white">Pending Actions</p>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: "Awaiting Pickup", value: logs.filter((l) => l.status === "Logged").length, color: "text-gray-400" },
                            { label: "Pickup Scheduled", value: logs.filter((l) => l.status === "Pickup Scheduled").length, color: "text-blue-400" },
                            { label: "Picked Up", value: logs.filter((l) => l.status === "Picked Up").length, color: "text-amber-400" },
                            { label: "Cert. Pending", value: logs.filter((l) => l.status === "Certificate Received").length, color: "text-violet-400" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs">{label}</span>
                                <span className={`text-sm font-bold ${color}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Category */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <p className="text-sm font-semibold text-white">Top Stats</p>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: "Top Category", value: topCategory },
                            { label: "Total Records", value: logs.length },
                            { label: "Closed Logs", value: closedLogs },
                            { label: "Pending Logs", value: pendingLogs },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs">{label}</span>
                                <span className="text-white text-xs font-semibold truncate max-w-[120px] text-right">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <h3 className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Recent Activity
                        </h3>
                    </div>
                    <button onClick={onViewLogs}
                        className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition">
                        View all <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {recentLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Recycle className="w-8 h-8 text-gray-700 mb-2" />
                        <p className="text-gray-500 text-sm">No logs yet. Add your first e-waste entry.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800/50">
                        {recentLogs.map((log) => (
                            <div key={log._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/20 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                                        <Recycle className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{log.itemName}</p>
                                        <p className="text-gray-500 text-xs">{log.category} · {log.weight} kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <span className={`text-xs font-medium ${STATUS_COLOR[log.status || "Logged"]}`}>
                                        {log.status || "Logged"}
                                    </span>
                                    <span className="text-gray-600 text-xs">
                                        {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: Plus, label: "Add New Log", sub: "Record e-waste item", onClick: onAddLog, color: "hover:border-emerald-500/40 hover:bg-emerald-500/5" },
                    { icon: BarChart2, label: "View Analytics", sub: "Charts & breakdowns", onClick: onViewAnalytics, color: "hover:border-blue-500/40 hover:bg-blue-500/5" },
                    { icon: Leaf, label: "CO₂ Impact", sub: "Environmental report", onClick: onViewImpact, color: "hover:border-green-500/40 hover:bg-green-500/5" },
                    { icon: FileDown, label: "Export Report", sub: "PDF or CSV audit report", onClick: onExport, color: "hover:border-violet-500/40 hover:bg-violet-500/5" },
                ].map(({ icon: Icon, label, sub, onClick, color }) => (
                    <button key={label} onClick={onClick}
                        className={`bg-gray-900/60 border border-gray-800 rounded-2xl p-5 text-left transition group ${color}`}>
                        <Icon className="w-6 h-6 text-gray-500 group-hover:text-white transition mb-3" />
                        <p className="text-white text-sm font-semibold">{label}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
                    </button>
                ))}
            </div>

        </div>
    );
}