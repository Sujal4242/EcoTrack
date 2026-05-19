import { X, BellRing, Mail, Loader2 } from "lucide-react";

export default function EmailModal({ email, emailRegistered, testSending, emailMsg, onRegister, onTest, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <BellRing className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Email Reminders</h2>
                            <p className="text-xs text-gray-500">Manage your notification preferences</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-300 transition" /></button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Registered Email</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-emerald-400" />
                            <span className="text-white text-sm font-medium">{email}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Reminder Schedule</p>
                        {[
                            { icon: "🔔", title: "Daily Reminder", desc: "Sent every day at 9:00 AM if no log recorded", badge: "Daily · 9:00 AM", badgeColor: "bg-amber-500/10 text-amber-400", color: "border-amber-500/20 bg-amber-500/5" },
                            { icon: "📊", title: "Monthly Summary", desc: "Full disposal report on the 1st of every month at 8AM", badge: "1st of month · 8:00 AM", badgeColor: "bg-blue-500/10 text-blue-400", color: "border-blue-500/20 bg-blue-500/5" },
                        ].map(({ icon, title, desc, badge, badgeColor, color }) => (
                            <div key={title} className={`border rounded-xl px-4 py-3.5 ${color}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3">
                                        <span className="text-xl mt-0.5">{icon}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}>{badge}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {emailMsg && (
                        <div className={`px-4 py-3 rounded-xl text-sm border ${emailMsg.startsWith("✅") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                            {emailMsg}
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Send Test Emails Now</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { type: "reminder", label: "Test Reminder", icon: "🔔", color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400" },
                                { type: "monthly", label: "Test Monthly", icon: "📊", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400" },
                            ].map(({ type, label, icon, color }) => (
                                <button key={type} onClick={() => onTest(type)} disabled={!!testSending}
                                    className={`flex items-center justify-center gap-2 border font-medium px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-50 ${color}`}>
                                    {testSending === type ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{icon}</span>}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-xs text-gray-600">Emails sent from EcoTrack system</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition">Close</button>
                        <button onClick={onRegister}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                            <Mail className="w-4 h-4" /> {emailRegistered ? "Registered ✓" : "Activate"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}