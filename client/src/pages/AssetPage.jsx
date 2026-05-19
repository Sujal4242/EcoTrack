import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Recycle, CheckCircle, Clock, Loader2 } from "lucide-react";

const STATUS_STYLE = {
    "Logged": "bg-gray-500/10 text-gray-400 border-gray-500/20",
    "Pickup Scheduled": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Picked Up": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Certificate Received": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "Closed": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const CO2_FACTORS = {
    "Computers & Laptops": 20,
    "Mobile Phones": 70,
    "Televisions": 15,
    "Printers & Peripherals": 18,
    "Batteries": 12,
    "Medical Equipment": 22,
    "Networking Devices": 25,
    "Other Electronics": 16,
};

export default function AssetPage() {
    const { id } = useParams();
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/wastelogs/public/${id}`)
            .then(({ data }) => setLog(data))
            .catch(() => setError("Asset not found."))
            .finally(() => setLoading(false));
    }, [id]);

    const co2 = log
        ? parseFloat((log.weight * (CO2_FACTORS[log.category] ?? 16)).toFixed(1))
        : 0;

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
            <Recycle className="w-10 h-10 text-gray-700" />
            <p className="text-gray-500">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-lg font-bold tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    EcoTrack
                </span>
                <span className="text-gray-600 text-sm ml-2">Asset Record</span>
            </div>

            <div className="max-w-lg mx-auto px-6 py-10 space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {log.itemName}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{log.category}</p>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${STATUS_STYLE[log.status || "Logged"]}`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {log.status || "Logged"}
                </div>

                {/* Details Grid */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl divide-y divide-gray-800">
                    {[
                        { label: "Serial Number", value: log.serialNumber || "—" },
                        { label: "Condition", value: log.condition || "—" },
                        { label: "Quantity", value: log.quantity ?? 1 },
                        { label: "Weight", value: `${log.weight} kg` },
                        { label: "Disposed Via", value: log.disposedVia || "—" },
                        {
                            label: "Date Logged", value: new Date(log.createdAt)
                                .toLocaleDateString("en-IN", {
                                    day: "numeric", month: "long", year: "numeric"
                                })
                        },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between px-5 py-3.5">
                            <span className="text-gray-500 text-sm">{label}</span>
                            <span className="text-white text-sm font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Notes */}
                {log.notes && (
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Notes</p>
                        <p className="text-gray-300 text-sm">{log.notes}</p>
                    </div>
                )}

                {/* CO2 Impact */}
                <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-2xl px-5 py-4 flex items-center gap-4">
                    <div className="text-3xl">🌱</div>
                    <div>
                        <p className="text-emerald-400 font-bold text-xl">{co2} kg CO₂</p>
                        <p className="text-gray-400 text-sm">prevented by recycling this item</p>
                    </div>
                </div>

                {/* Status History */}
                {log.statusHistory?.length > 0 && (
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                            Disposal History
                        </p>
                        <div className="space-y-3">
                            {[...log.statusHistory].reverse().map((h, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        {i < log.statusHistory.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-700 my-1" />
                                        )}
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-sm text-white font-medium">{h.status}</p>
                                        {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                                        <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(h.changedAt).toLocaleString("en-IN", {
                                                day: "numeric", month: "short",
                                                year: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-gray-700 text-xs pb-4">
                    Verified e-waste disposal record · EcoTrack © 2026
                </p>
            </div>
        </div>
    );
}