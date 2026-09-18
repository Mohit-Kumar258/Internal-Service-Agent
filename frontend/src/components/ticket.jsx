import { useEffect, useState } from "react";
import axios from "axios";
import {
  Ticket as TicketIcon,
  RefreshCw,
  Search,
} from "lucide-react";

const API_BASE_URL = "https://veridian-it-backend-nine.vercel.app";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tickets`
      );

      setTickets(response.data.tickets || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load tickets from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* -----------------------------------------
     Determine whether ticket is active
  ----------------------------------------- */

  const isActiveTicket = (ticket) => {
    const status = (ticket.status || "").toLowerCase();

    return (
      status.includes("active") ||
      status.includes("escalated") ||
      status.includes("pending")
    );
  };

  /* -----------------------------------------
     Filter tickets
  ----------------------------------------- */

  const filteredTickets = tickets.filter((ticket) => {
    const text = `
      ${ticket.id || ticket.ticket_id || ""}
      ${ticket.employee_name || ticket.employee || ""}
      ${ticket.request || ""}
      ${ticket.issue_summary || ""}
      ${ticket.status || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  /* -----------------------------------------
     Status styling
  ----------------------------------------- */

  const getStatusStyle = (status = "") => {
    const value = status.toLowerCase();

    if (isActiveTicket({ status })) {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (
      value.includes("resolved") ||
      value.includes("closed")
    ) {
      return "border-green-500/30 bg-green-500/10 text-green-300";
    }

    if (value.includes("rejected")) {
      return "border-slate-600 bg-slate-800 text-slate-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  };

  /* -----------------------------------------
     Dashboard counts
  ----------------------------------------- */

  const activeCount = tickets.filter(isActiveTicket).length;

  const closedCount = tickets.length - activeCount;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-sm font-medium text-blue-400">
            SERVICE MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            IT Tickets
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            View escalated requests and ticket history stored in MongoDB.
          </p>
        </div>

        <button
          onClick={fetchTickets}
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

        {/* Total */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs text-slate-500">
            Total Tickets
          </p>

          <p className="mt-2 text-2xl font-bold">
            {tickets.length}
          </p>
        </div>


        {/* Active */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-xs text-slate-500">
            Escalated / Active
          </p>

          <p className="mt-2 text-2xl font-bold text-red-300">
            {activeCount}
          </p>
        </div>


        {/* Closed */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <p className="text-xs text-slate-500">
            Closed / Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-green-300">
            {closedCount}
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
            placeholder="Search tickets, employees, issues..."
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
          Loading tickets...
        </div>
      )}


      {/* Tickets */}
      {!loading && !error && (
        <div className="space-y-3">

          {filteredTickets.map((ticket, index) => {

            const ticketId =
              ticket.id ||
              ticket.ticket_id ||
              `Ticket-${index + 1}`;

            const employee =
              ticket.employee_name ||
              ticket.employee ||
              "Unknown";

            const issue =
              ticket.request ||
              ticket.issue_summary ||
              "No issue description available";

            const status =
              ticket.status ||
              "Unknown";

            return (
              <div
                key={`${ticketId}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* Ticket info */}
                  <div className="flex gap-4">

                    <div className="mt-1 rounded-xl bg-blue-500/10 p-3 text-blue-400">
                      <TicketIcon size={20} />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-semibold">
                          {ticketId}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-slate-300">
                        {issue}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Employee: {employee}
                      </p>

                    </div>

                  </div>


                  {/* Source */}
                  <div className="lg:text-right">

                    {ticket.sources?.length > 0 ? (

                      <div className="flex flex-wrap gap-2 lg:justify-end">

                        {ticket.sources.map((source) => (

                          <span
                            key={source}
                            className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300"
                          >
                            {source}
                          </span>

                        ))}

                      </div>

                    ) : (

                      <span className="text-xs text-slate-600">
                        No policy source
                      </span>
                    )}


                    {ticket.created_at && (
                      <p className="mt-2 text-xs text-slate-600">
                        {new Date(
                          ticket.created_at
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>

                </div>

              </div>
            );
          })}


          {filteredTickets.length === 0 && (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <TicketIcon
                size={30}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-400">
                No tickets found.
              </p>

            </div>

          )}

        </div>
      )}

    </div>
  );
}

export default Tickets;
