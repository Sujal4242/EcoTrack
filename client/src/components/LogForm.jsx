import { Save, XCircle, Loader2 } from "lucide-react";
import { CATEGORIES, CONDITIONS, EMPTY_FORM } from "../constants";

export default function LogForm({ form, setForm, editingLog, onSubmit, onClose, submitting, error }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingLog ? "Edit Log" : "Add New Waste Log"}
                </h2>
                <button onClick={onClose}>
                    <XCircle className="w-5 h-5 text-gray-600 hover:text-gray-400 transition" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                    { label: "Item Name *", key: "itemName", placeholder: "e.g. Dell Laptop" },
                    { label: "Serial Number", key: "serialNumber", placeholder: "e.g. SN123456" },
                    { label: "Disposed Via", key: "disposedVia", placeholder: "e.g. Attero Recycling" },
                ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                        <label className="text-xs text-gray-500 uppercase tracking-widest">{label}</label>
                        <input type="text" placeholder={placeholder} value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition">
                        <option value="" disabled>Select</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Condition</label>
                    <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                        className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition">
                        {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Weight (kg) *</label>
                    <input type="number" placeholder="e.g. 2.5" min="0" step="0.1" value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Quantity</label>
                    <input type="number" placeholder="1" min="1" value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                </div>
            </div>

            <div className="space-y-1.5 mb-5">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Notes</label>
                <textarea placeholder="Any additional notes..." value={form.notes} rows={2}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition resize-none" />
            </div>

            <button onClick={onSubmit} disabled={submitting}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    : <><Save className="w-4 h-4" /> {editingLog ? "Update Log" : "Add Log"}</>}
            </button>
        </div>
    );
}