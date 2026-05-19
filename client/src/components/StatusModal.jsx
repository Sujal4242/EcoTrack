import { X, Activity, Loader2 } from "lucide-react";
import { STATUSES, STATUS_STYLE, STATUS_STEP } from "../constants";

export default function StatusModal({ log, newStatus, setNewStatus, statusNote, setStatusNote, onSave, onClose, saving }) {
    const current = STATUS_STEP[log.status || "Logged"];
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Update Status</h2>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{log.itemName}</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-300 transition" /></button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Stepper */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Disposal Lifecycle</p>
                        <div className="flex items-center">
                            {STATUSES.map((s, i) => {
                                const isDone = i <= current;
                                const isLast = i === STATUSES.length - 1;
                                return (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-shrink-0">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500" : "bg-gray-800 border-gray-600"}`}>
                                                {isDone && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <p className="text-[9px] text-gray-500 mt-1 text-center w-14 leading-tight">{s}</p>
                                        </div>
                                        {!isLast && <div className={`flex-1 h-0.5 mb-4 ${i < current ? "bg-emerald-500" : "bg-gray-700"}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status Selector */}
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Set New Status</p>
                        {STATUSES.map((s) => (
                            <button key={s} onClick={() => setNewStatus(s)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition text-left ${newStatus === s ? STATUS_STYLE[s].badge : "bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${newStatus === s ? STATUS_STYLE[s].dot : "bg-gray-600"}`} />
                                {s}
                                {(log.status || "Logged") === s && <span className="ml-auto text-xs text-gray-600">current</span>}
                            </button>
                        ))}
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 uppercase tracking-widest">Add a Note (optional)</label>
                        <textarea placeholder="e.g. Pickup confirmed for Monday 10am..." value={statusNote} rows={2}
                            onChange={(e) => setStatusNote(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition resize-none" />
                    </div>

                    {/* History */}
                    {log.statusHistory?.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">History</p>
                            <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3 space-y-3 max-h-40 overflow-y-auto">
                                {[...log.statusHistory].reverse().map((h, i) => (
                                    <div key={i} className="flex gap-3">
                                        <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${STATUS_STYLE[h.status]?.dot ?? "bg-gray-500"}`} />
                                        <div>
                                            <p className="text-xs text-white font-medium">{h.status}</p>
                                            {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                {new Date(h.changedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition">Cancel</button>
                    <button onClick={onSave} disabled={saving || newStatus === log.status}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-sm transition">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Activity className="w-4 h-4" /> Update Status</>}
                    </button>
                </div>
            </div>
        </div>
    );
}