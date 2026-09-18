import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const API_BASE_URL = "https://veridian-it-backend-nine.vercel.app";

function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/audit`
      );

      setLogs(response.data.logs || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const text = `
      ${log.employee_message || ""}
      ${log.decision || ""}
      ${log.ticket_id || ""}
      ${(log.sources || []).join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const getDecisionStyle = (decision) => {
    if (decision === "RESOLVE") {
      return "border-green-500/30 bg-green-500/10 text-green-300";
    }

    if (decision === "ESCALATE") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  };

  const getDecisionIcon = (decision) => {
    if (decision === "RESOLVE") {
      return <CheckCircle2 size={17} />;
    }

    if (decision === "ESCALATE") {
      return <AlertTriangle size={17} />;
    }

    return <HelpCircle size={17} />;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-sm font-medium text-blue-400">
            SYSTEM ACTIVITY
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Audit Trail
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Complete record of agent decisions, sources, and escalations.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs text-slate-500">
            Total Events
          </p>

          <p className="mt-2 text-2xl font-bold">
            {logs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <p className="text-xs text-slate-500">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-green-300">
            {
              logs.filter(
                (log) => log.decision === "RESOLVE"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-xs text-slate-500">
            Escalated
          </p>

          <p className="mt-2 text-2xl font-bold text-red-300">
            {
              logs.filter(
                (log) => log.decision === "ESCALATE"
              ).length
            }
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search audit events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
          />

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
          Loading audit trail...
        </div>
      )}

      {/* Logs */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {/* Table header */}
          <div className="hidden grid-cols-[160px_1fr_140px_120px] gap-4 border-b border-slate-800 bg-slate-800/40 px-5 py-3 text-xs font-medium text-slate-500 md:grid">
            <span>Timestamp</span>
            <span>Employee Request</span>
            <span>Decision</span>
            <span>Ticket / Source</span>
          </div>

          {filteredLogs.map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className="border-b border-slate-800 p-5 last:border-b-0 hover:bg-slate-800/30"
            >

              <div className="grid gap-4 md:grid-cols-[160px_1fr_140px_120px] md:items-center">

                {/* Timestamp */}
                <div>
                  <p className="text-xs text-slate-500">
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleDateString()
                      : "—"}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString()
                      : ""}
                  </p>
                </div>

                {/* Request */}
                <div>

                  <p className="text-sm leading-relaxed text-slate-300">
                    {log.employee_message || "No message"}
                  </p>

                  {log.sources?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">

                      {log.sources.map((source) => (
                        <span
                          key={source}
                          className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-300"
                        >
                          {source}
                        </span>
                      ))}

                    </div>
                  )}

                </div>

                {/* Decision */}
                <div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getDecisionStyle(
                      log.decision
                    )}`}
                  >
                    {getDecisionIcon(log.decision)}
                    {log.decision}
                  </span>

                </div>

                {/* Ticket */}
                <div>

                  {log.ticket_id ? (
                    <span className="text-xs font-medium text-red-300">
                      {log.ticket_id}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">
                      No ticket
                    </span>
                  )}

                </div>

              </div>

            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-10 text-center">

              <ClipboardList
                size={30}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-400">
                No audit events found.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default AuditTrail;
