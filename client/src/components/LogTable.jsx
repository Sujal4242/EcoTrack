import { Recycle, Trash2, Pencil, Loader2, CheckSquare, Square, Activity, QrCode } from "lucide-react";
import { BADGE, COND_BADGE, STATUS_STYLE } from "../constants";

export default function LogTable({ logs, loading, selected, onToggleSelect, onToggleAll, onEdit, onDelete, onStatus, onQr, deletingId }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Disposal Records
                </h2>
                <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Recycle className="w-10 h-10 text-gray-700 mb-3" />
                    <p className="text-gray-500 text-sm">No records found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-widest">
                                <th className="px-4 py-3 text-left">
                                    <button onClick={onToggleAll}>
                                        {selected.length === logs.length
                                            ? <CheckSquare className="w-4 h-4 text-emerald-400" />
                                            : <Square className="w-4 h-4" />}
                                    </button>
                                </th>
                                {["#", "Item", "Category", "Condition", "Status", "Qty", "Weight", "Vendor", "Date", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left last:text-right">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, i) => (
                                <tr key={log._id}
                                    className={`border-b border-gray-800/50 transition ${selected.includes(log._id) ? "bg-red-500/5" : "hover:bg-gray-800/30"}`}>
                                    <td className="px-4 py-4">
                                        <button onClick={() => onToggleSelect(log._id)}>
                                            {selected.includes(log._id)
                                                ? <CheckSquare className="w-4 h-4 text-emerald-400" />
                                                : <Square className="w-4 h-4 text-gray-600" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{i + 1}</td>
                                    <td className="px-4 py-4">
                                        <p className="text-white font-medium">{log.itemName}</p>
                                        {log.serialNumber && <p className="text-gray-600 text-xs">S/N: {log.serialNumber}</p>}
                                        {log.notes && <p className="text-gray-600 text-xs truncate max-w-[140px]">{log.notes}</p>}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${BADGE[log.category] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                                            {log.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${COND_BADGE[log.condition] ?? ""}`}>
                                            {log.condition ?? "—"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => onStatus(log)}
                                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition hover:opacity-80 ${STATUS_STYLE[log.status || "Logged"].badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLE[log.status || "Logged"].dot}`} />
                                            {log.status || "Logged"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-gray-300">{log.quantity ?? 1}</td>
                                    <td className="px-4 py-4 text-gray-300">{log.weight} kg</td>
                                    <td className="px-4 py-4 text-gray-500 text-xs">{log.disposedVia || "—"}</td>
                                    <td className="px-4 py-4 text-gray-500 text-xs">
                                        {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => onQr(log)} className="text-gray-600 hover:text-violet-400 transition p-1.5 rounded-lg hover:bg-violet-500/10">
                                                <QrCode className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onEdit(log)} className="text-gray-600 hover:text-emerald-400 transition p-1.5 rounded-lg hover:bg-emerald-500/10">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(log._id)} disabled={deletingId === log._id}
                                                className="text-gray-600 hover:text-red-400 disabled:opacity-40 transition p-1.5 rounded-lg hover:bg-red-500/10">
                                                {deletingId === log._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}