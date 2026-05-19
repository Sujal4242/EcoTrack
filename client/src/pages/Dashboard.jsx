import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

// Components
import Navbar from "../components/Navbar";
import StatCards from "../components/StatCards";
import LogForm from "../components/LogForm";
import FiltersBar from "../components/FiltersBar";
import LogTable from "../components/LogTable";
import ChartsTab from "../components/ChartsTab";
import ImpactTab from "../components/ImpactTab";

// Modals (kept inline — small enough)
import StatusModal from "../components/StatusModal";
import QrModal from "../components/QrModal";
import AuditModal from "../components/AuditModal";
import EmailModal from "../components/EmailModal";

// Home Page
import HomePage from "./HomePage";

import {
  Plus, Trash2, AlertCircle, X, Loader2,
  Layers, BarChart2, Leaf, FileDown, Home,
} from "lucide-react";

import {
  API, API_BASE, EMPTY_FORM, CATEGORIES, CONDITIONS,
  STATUSES, STATUS_STYLE, STATUS_STEP,
  CO2_FACTORS, TREE_FACTOR, KWH_FACTOR,
} from "../constants";

export default function Dashboard() {
  const { user, logout } = usePrivy();
  const privyUserId = user?.id;
  const email = user?.email?.address ?? user?.id;

  // Data
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI
  const [activeTab, setActiveTab] = useState("home");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [selected, setSelected] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Form
  const [form, setForm] = useState(EMPTY_FORM);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [qrLog, setQrLog] = useState(null);
  const [showAudit, setShowAudit] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [emailRegistered, setEmailRegistered] = useState(false);
  const [testSending, setTestSending] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [auditForm, setAuditForm] = useState({
    startDate: "", endDate: "", category: "",
    condition: "", itemName: "", disposedVia: "",
  });

  const fetchLogs = useCallback(async () => {
    try {
      const params = { privyUserId };
      if (filterCat) params.category = filterCat;
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const { data } = await axios.get(API, { params });
      setLogs(data);
    } catch { setError("Failed to fetch logs."); }
    finally { setLoading(false); }
  }, [privyUserId, filterCat, search, startDate, endDate]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/stats`, { params: { privyUserId } });
      setStats(data);
    } catch { }
  }, [privyUserId]);

  useEffect(() => { fetchLogs(); fetchStats(); }, [fetchLogs, fetchStats]);

  const co2Data = useMemo(() => {
    if (!stats?.byCategory?.length) return { totalCO2: 0, trees: 0, kwh: 0, byCategory: [] };
    const byCategory = stats.byCategory.map((row) => ({
      category: row._id, totalWeight: row.totalWeight,
      co2Saved: parseFloat((row.totalWeight * (CO2_FACTORS[row._id] ?? 16)).toFixed(1)),
    }));
    const totalCO2 = parseFloat(byCategory.reduce((s, r) => s + r.co2Saved, 0).toFixed(1));
    return {
      totalCO2,
      trees: Math.floor(totalCO2 / TREE_FACTOR),
      kwh: parseFloat((totalCO2 / KWH_FACTOR).toFixed(1)),
      byCategory,
    };
  }, [stats]);

  const handleSubmit = async () => {
    if (!form.itemName || !form.category || !form.weight) {
      setError("Item name, category, and weight are required."); return;
    }
    setError(""); setSubmitting(true);
    try {
      if (editingLog) {
        await axios.put(`${API}/${editingLog._id}`, { ...form, weight: parseFloat(form.weight) });
      } else {
        await axios.post(API, { privyUserId, ...form, weight: parseFloat(form.weight) });
      }
      setForm(EMPTY_FORM); setShowForm(false); setEditingLog(null);
      fetchLogs(); fetchStats();
    } catch { setError("Failed to save log."); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setForm({
      itemName: log.itemName, category: log.category, weight: log.weight,
      quantity: log.quantity ?? 1, condition: log.condition ?? "Dead",
      disposedVia: log.disposedVia ?? "", serialNumber: log.serialNumber ?? "", notes: log.notes ?? ""
    });
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/${id}`);
      setLogs((p) => p.filter((l) => l._id !== id)); fetchStats();
    } catch { setError("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await axios.delete(`${API}/bulk/many`, { data: { ids: selected } });
      setLogs((p) => p.filter((l) => !selected.includes(l._id)));
      setSelected([]); fetchStats();
    } catch { setError("Bulk delete failed."); }
    finally { setBulkDeleting(false); }
  };

  const handleStatusUpdate = async () => {
    setStatusSaving(true);
    try {
      const { data } = await axios.patch(`${API}/${statusModal._id}/status`, { status: newStatus, note: statusNote });
      setLogs((p) => p.map((l) => l._id === data._id ? data : l));
      setStatusModal(null); setStatusNote(""); setNewStatus("");
    } catch { setError("Failed to update status."); }
    finally { setStatusSaving(false); }
  };

  const handleExportPDF = async () => {
    setAuditLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/audit`,
        { privyUserId, userEmail: email, ...auditForm }, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url;
      a.setAttribute("download", `EcoTrack_Audit_${Date.now()}.pdf`);
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url); setShowAudit(false);
    } catch { setError("Failed to generate PDF."); }
    finally { setAuditLoading(false); }
  };

  const handleExportCSV = async () => {
    setCsvLoading(true);
    try {
      const params = { privyUserId, ...Object.fromEntries(Object.entries(auditForm).filter(([, v]) => v)) };
      const res = await axios.get(`${API}/export/csv`, { params, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url;
      a.setAttribute("download", `EcoTrack_Export_${Date.now()}.csv`);
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url); setShowAudit(false);
    } catch { setError("Failed to export CSV."); }
    finally { setCsvLoading(false); }
  };

  const registerEmail = async () => {
    try {
      await axios.post(`${API_BASE}/api/email/register`, { privyUserId, email });
      setEmailRegistered(true); setEmailMsg("✅ Email registered for reminders!");
    } catch { setEmailMsg("❌ Failed to register email."); }
  };

  const sendTestEmail = async (type) => {
    setTestSending(type); setEmailMsg("");
    try {
      await axios.post(`${API_BASE}/api/email/test-${type}`, { privyUserId, email });
      setEmailMsg(`✅ Test ${type === "reminder" ? "reminder" : "monthly summary"} sent to ${email}`);
    } catch { setEmailMsg("❌ Failed to send test email."); }
    finally { setTestSending(""); }
  };

  const toggleSelect = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleSelectAll = () => setSelected(selected.length === logs.length ? [] : logs.map((l) => l._id));
  const clearFilters = () => { setSearch(""); setFilterCat(""); setStartDate(""); setEndDate(""); };
  const openStatusModal = (log) => { setStatusModal(log); setNewStatus(log.status || "Logged"); setStatusNote(""); };

  const totalWeight = stats?.totalWeight ?? 0;
  const topCat = stats?.byCategory?.[0]?._id ?? "—";

  const TABS = [
    { id: "home", label: "Home", icon: Home },
    { id: "logs", label: "Disposal Records", icon: Layers },
    { id: "charts", label: "Analytics", icon: BarChart2 },
    { id: "impact", label: "CO₂ Impact", icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar email={email} onLogout={logout} onReminders={() => setShowEmailSettings(true)} />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Waste Disposal Manager
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Log, track, and manage your organization's e-waste disposal records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAudit(true)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition border border-gray-700">
              <FileDown className="w-4 h-4 text-emerald-400" /> Export
            </button>
            <button onClick={() => { setShowForm(!showForm); setEditingLog(null); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> Add Log
            </button>
          </div>
        </div>

        <StatCards totalLogs={logs.length} totalWeight={totalWeight} topCategory={topCat} />

        {error && (
          <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>
            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
          </div>
        )}

        {showForm && (
          <LogForm form={form} setForm={setForm} editingLog={editingLog}
            onSubmit={handleSubmit} onClose={() => { setShowForm(false); setEditingLog(null); setForm(EMPTY_FORM); }}
            submitting={submitting} />
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${activeTab === id ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-500 hover:text-gray-300"
                }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "home" && (
          <HomePage logs={logs} stats={stats} co2Data={co2Data}
            onAddLog={() => { setShowForm(true); setActiveTab("logs"); }}
            onViewLogs={() => setActiveTab("logs")}
            onViewAnalytics={() => setActiveTab("charts")}
            onViewImpact={() => setActiveTab("impact")}
            onExport={() => setShowAudit(true)}
          />
        )}

        {activeTab === "logs" && (
          <div className="space-y-4">
            <FiltersBar search={search} setSearch={setSearch} filterCat={filterCat}
              setFilterCat={setFilterCat} startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate} onClear={clearFilters} />

            {selected.length > 0 && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm">{selected.length} selected</span>
                <button onClick={handleBulkDelete} disabled={bulkDeleting}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition">
                  {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...</> : <><Trash2 className="w-3.5 h-3.5" /> Delete Selected</>}
                </button>
                <button onClick={() => setSelected([])} className="text-gray-500 hover:text-gray-300 text-sm transition">Cancel</button>
              </div>
            )}

            <LogTable logs={logs} loading={loading} selected={selected}
              onToggleSelect={toggleSelect} onToggleAll={toggleSelectAll}
              onEdit={handleEdit} onDelete={handleDelete}
              onStatus={openStatusModal} onQr={setQrLog} deletingId={deletingId} />
          </div>
        )}

        {activeTab === "charts" && <ChartsTab stats={stats} />}
        {activeTab === "impact" && <ImpactTab co2Data={co2Data} stats={stats} />}
      </div>

      {/* All Modals */}
      {statusModal && (
        <StatusModal log={statusModal} newStatus={newStatus} setNewStatus={setNewStatus}
          statusNote={statusNote} setStatusNote={setStatusNote}
          onSave={handleStatusUpdate} onClose={() => setStatusModal(null)} saving={statusSaving} />
      )}
      {qrLog && <QrModal log={qrLog} onClose={() => setQrLog(null)} />}
      {showAudit && (
        <AuditModal auditForm={auditForm} setAuditForm={setAuditForm}
          onExportPDF={handleExportPDF} onExportCSV={handleExportCSV}
          auditLoading={auditLoading} csvLoading={csvLoading}
          onClose={() => setShowAudit(false)} />
      )}
      {showEmailSettings && (
        <EmailModal email={email} emailRegistered={emailRegistered}
          testSending={testSending} emailMsg={emailMsg}
          onRegister={registerEmail} onTest={sendTestEmail}
          onClose={() => { setShowEmailSettings(false); setEmailMsg(""); }} />
      )}
    </div>
  );
}