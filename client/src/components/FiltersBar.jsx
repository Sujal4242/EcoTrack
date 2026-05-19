import { Search, Filter } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function FiltersBar({ search, setSearch, filterCat, setFilterCat, startDate, setStartDate, endDate, setEndDate, onClear }) {
    const hasFilters = search || filterCat || startDate || endDate;
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input placeholder="Search item name..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                </div>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                    className="bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition">
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
            </div>
            {hasFilters && (
                <button onClick={onClear}
                    className="mt-3 text-xs text-gray-500 hover:text-emerald-400 flex items-center gap-1 transition">
                    <Filter className="w-3 h-3" /> Clear filters
                </button>
            )}
        </div>
    );
}