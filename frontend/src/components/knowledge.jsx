import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Search,
  RefreshCw,
  FileText,
} from "lucide-react";

const API_BASE_URL = "https://veridian-it-backend-nine.vercel.app";

function KnowledgeBase() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolicies = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/knowledge`
      );

      setPolicies(response.data.policies || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load the knowledge base.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter((policy) => {
    const text = `
      ${policy.id || ""}
      ${policy.title || ""}
      ${policy.content || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-sm font-medium text-blue-400">
            GROUNDED KNOWLEDGE
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Knowledge Base
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Controlled Veridian Corp IT policies used by the AI agent.
          </p>
        </div>

        <button
          onClick={fetchPolicies}
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
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <BookOpen size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Available Policies
              </p>

              <p className="text-2xl font-bold">
                {policies.length}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

          <p className="text-xs text-slate-500">
            Knowledge Status
          </p>

          <p className="mt-2 text-lg font-semibold text-green-300">
            Grounded
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Agent responses use supplied policy data.
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
            placeholder="Search policies..."
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
          Loading knowledge base...
        </div>
      )}

      {/* Policies */}
      {!loading && !error && (
        <div className="grid gap-4 lg:grid-cols-2">

          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
            >

              <div className="mb-4 flex items-start justify-between gap-4">

                <div className="flex gap-3">

                  <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                    <FileText size={19} />
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-blue-400">
                      {policy.id}
                    </span>

                    <h2 className="mt-1 font-semibold">
                      {policy.title}
                    </h2>
                  </div>

                </div>

              </div>

              <p className="text-sm leading-6 text-slate-400">
                {policy.content}
              </p>

            </div>
          ))}

          {filteredPolicies.length === 0 && (
            <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <BookOpen
                size={30}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-400">
                No policies match your search.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default KnowledgeBase;
