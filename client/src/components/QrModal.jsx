import { X, QrCode, FileDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QrModal({ log, onClose }) {
    const handleDownload = () => {
        const svg = document.querySelector("#qr-download svg");
        if (!svg) return;
        const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `QR_${log.itemName}_${log._id}.svg`;
        a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Asset QR Code</h2>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{log.itemName}</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-300 transition" /></button>
                </div>

                <div className="px-6 py-6 space-y-5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-4 rounded-2xl" id="qr-download">
                            <QRCodeSVG value={`http://localhost:5173/asset/${log._id}`} size={180}
                                bgColor="#ffffff" fgColor="#111827" level="H" includeMargin={false} />
                        </div>
                        <p className="text-xs text-gray-600 text-center">Scan to view full asset details & disposal status</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4 space-y-2.5">
                        {[
                            { label: "Item", value: log.itemName },
                            { label: "Category", value: log.category },
                            { label: "S/N", value: log.serialNumber || "—" },
                            { label: "Status", value: log.status || "Logged" },
                            { label: "Weight", value: `${log.weight} kg` },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
                                <span className="text-xs text-white font-medium">{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl px-4 py-2.5 flex items-center justify-between">
                        <span className="text-xs text-gray-600">Asset ID</span>
                        <span className="text-xs font-mono text-gray-400 truncate max-w-[200px]">{log._id}</span>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition">Close</button>
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                        <FileDown className="w-4 h-4" /> Download QR
                    </button>
                </div>
            </div>
        </div>
    );
}