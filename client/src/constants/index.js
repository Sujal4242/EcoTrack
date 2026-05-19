export const CATEGORIES = [
    "Computers & Laptops", "Mobile Phones", "Televisions",
    "Printers & Peripherals", "Batteries", "Medical Equipment",
    "Networking Devices", "Other Electronics",
];

export const CONDITIONS = ["Working", "Damaged", "Dead"];

export const STATUSES = [
    "Logged", "Pickup Scheduled", "Picked Up",
    "Certificate Received", "Closed",
];

export const CAT_COLORS = {
    "Computers & Laptops": "#3b82f6",
    "Mobile Phones": "#8b5cf6",
    "Televisions": "#f59e0b",
    "Printers & Peripherals": "#ec4899",
    "Batteries": "#ef4444",
    "Medical Equipment": "#14b8a6",
    "Networking Devices": "#06b6d4",
    "Other Electronics": "#6b7280",
};

export const BADGE = {
    "Computers & Laptops": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Mobile Phones": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "Televisions": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Printers & Peripherals": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Batteries": "bg-red-500/10 text-red-400 border-red-500/20",
    "Medical Equipment": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    "Networking Devices": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Other Electronics": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export const COND_BADGE = {
    Working: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Damaged: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dead: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const STATUS_STYLE = {
    "Logged": { badge: "bg-gray-500/10 text-gray-400 border-gray-500/20", dot: "bg-gray-400" },
    "Pickup Scheduled": { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
    "Picked Up": { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
    "Certificate Received": { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", dot: "bg-violet-400" },
    "Closed": { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
};

export const STATUS_STEP = {
    "Logged": 0, "Pickup Scheduled": 1, "Picked Up": 2,
    "Certificate Received": 3, "Closed": 4,
};

export const CO2_FACTORS = {
    "Computers & Laptops": 20,
    "Mobile Phones": 70,
    "Televisions": 15,
    "Printers & Peripherals": 18,
    "Batteries": 12,
    "Medical Equipment": 22,
    "Networking Devices": 25,
    "Other Electronics": 16,
};

export const TREE_FACTOR = 21;
export const KWH_FACTOR = 0.82;

export const EMPTY_FORM = {
    itemName: "", category: "", weight: "", quantity: 1,
    condition: "Dead", disposedVia: "", serialNumber: "", notes: "",
};

export const API = "http://localhost:5000/api/wastelogs";
export const API_BASE = "http://localhost:5000";