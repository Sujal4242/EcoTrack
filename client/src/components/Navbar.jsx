import { Recycle, LogOut, BellRing } from "lucide-react";

export default function Navbar({ email, onLogout, onReminders }) {
    return (
        <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Recycle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-lg font-bold tracking-tight"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        EcoTrack
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:block">{email}</span>
                    <button onClick={onReminders}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 px-3 py-1.5 rounded-lg transition">
                        <BellRing className="w-3.5 h-3.5 text-emerald-400" /> Reminders
                    </button>
                    <button onClick={onLogout}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 px-3 py-1.5 rounded-lg transition">
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}