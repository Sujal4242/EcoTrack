import { X, FileDown, Loader2, FileSpreadsheet } from "lucide-react";
import { CATEGORIES, CONDITIONS } from "../constants";

export default function AuditModal({ auditForm, setAuditForm, onExportPDF, onExportCSV, auditLoading, csvLoading, onClose }) {
    const clear = () => setAuditForm({ startDate: "", endDate: "", category: "", condition: "", itemName: "", disposedVia: "" });

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <FileDown className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Export Audit Report</h2>
                            <p className="text-xs text-gray-500">Apply filters then export as PDF or CSV</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-300 transition" /></button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Date Range</p>
                        <div className="grid grid-cols-2 gap-3">
                            {["startDate", "endDate"].map((key) => (
                                <div key={key}>
                                    <label className="text-xs text-gray-600 mb-1 block">{key === "startDate" ? "From" : "To"}</label>
                                    <input type="date" value={auditForm[key]}
                                        onChange={(e) => setAuditForm({ ...auditForm, [key]: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">Category</label>
                            <select value={auditForm.category} onChange={(e) => setAuditForm({ ...auditForm, category: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition">
                                <option value="">All Categories</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">Condition</label>
                            <select value={auditForm.condition} onChange={(e) => setAuditForm({ ...auditForm, condition: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition">
                                <option value="">All Conditions</option>
                                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[["itemName", "Item Name", "e.g. Dell Laptop"], ["disposedVia", "Disposed Via", "e.g. Attero"]].map(([key, label, ph]) => (
                            <div key={key}>
                                <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">{label}</label>
                                <input type="text" placeholder={ph} value={auditForm[key]}
                                    onChange={(e) => setAuditForm({ ...auditForm, [key]: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-400 space-y-1">
                        <p className="text-gray-300 font-semibold mb-1">Report will include:</p>
                        <p>• Date: {auditForm.startDate || auditForm.endDate ? `${auditForm.startDate || "Any"} → ${auditForm.endDate || "Any"}` : "All dates"}</p>
                        <p>• Category: {auditForm.category || "All"} · Condition: {auditForm.condition || "All"}</p>
                        <p>• Item: {auditForm.itemName || "All"} · Vendor: {auditForm.disposedVia || "All"}</p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                    <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-300 transition">Clear filters</button>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition">Cancel</button>
                        <button onClick={onExportCSV} disabled={csvLoading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                            {csvLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</> : <><FileSpreadsheet className="w-4 h-4" /> CSV</>}
                        </button>
                        <button onClick={onExportPDF} disabled={auditLoading}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                            {auditLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileDown className="w-4 h-4" /> PDF</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}