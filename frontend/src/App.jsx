import { useState, useEffect } from "react";

import AISupport from "./components/aisupport";
import Sidebar from "./components/sidebar";
import Tickets from "./components/ticket";
import AuditTrail from "./components/audittrail";
import KnowledgeBase from "./components/knowledge";

import {
  Bot,
  Ticket,
  BookOpen,
  Activity,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";


function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main content */}
      <div className="ml-64 min-h-screen">

        {/* Top bar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-8">

          <div>
            <h2 className="text-xl font-semibold">
              {activePage === "dashboard" && "Dashboard"}
              {activePage === "support" && "AI Support"}
              {activePage === "tickets" && "Tickets"}
              {activePage === "audit" && "Audit Trail"}
              {activePage === "knowledge" && "Knowledge Base"}
            </h2>

            <p className="text-sm text-slate-400">
              Veridian Corp Internal IT Services
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            <span className="h-2 w-2 rounded-full bg-green-400"></span>
            Agent Online
          </div>

        </header>


        {/* Page */}
        <main className="p-8">

          {activePage === "dashboard" && (
            <Dashboard setActivePage={setActivePage} />
          )}

          {activePage === "support" && <AISupport />}

          {activePage === "tickets" && <Tickets />}

          {activePage === "audit" && <AuditTrail />}

          {activePage === "knowledge" && <KnowledgeBase />}

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ setActivePage }) {

  const [stats, setStats] = useState({
    tickets_total: 0,
    tickets_active: 0,
    knowledge_base: 0,
    audit_events: 0,
    decision_counts: {
      RESOLVE: 0,
      ASK_FOLLOWUP: 0,
      ESCALATE: 0,
    },
  });

  const [loading, setLoading] = useState(true);


  /* Fetch live dashboard data */
  const fetchStats = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setStats(data);

    } catch (error) {

      console.error("Dashboard error:", error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchStats();
  }, []);


  const cards = [

    {
      title: "AI Support",
      value: "Online",
      description: "Ready to assist employees",
      icon: Bot,
      page: "support",
    },

    {
      title: "Open Tickets",
      value: loading ? "..." : stats.tickets_active,
      description: `${stats.tickets_total} total tickets`,
      icon: Ticket,
      page: "tickets",
    },

    {
      title: "Knowledge Base",
      value: loading ? "..." : stats.knowledge_base,
      description: "Grounded IT policies",
      icon: BookOpen,
      page: "knowledge",
    },

    {
      title: "Audit Events",
      value: loading ? "..." : stats.audit_events,
      description: "Agent interactions logged",
      icon: Activity,
      page: "audit",
    },

  ];


  return (
    <div className="space-y-8">


      {/* =====================================================
          WELCOME
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="mb-2 text-sm font-medium tracking-wide text-blue-400">
            INTERNAL IT SERVICES
          </p>

          <h1 className="text-3xl font-bold">
            Welcome to Veridian IT Support
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Use the AI support agent to resolve IT requests,
            retrieve company policies, and escalate issues that
            require additional review.
          </p>

        </div>


        {/* Refresh */}
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 transition hover:border-blue-500/50 hover:text-white"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>



      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <button
              key={card.title}
              onClick={() => setActivePage(card.page)}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-800"
            >

              <div className="mb-5 flex items-center justify-between">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Icon size={22} />
                </div>

                <span className="text-lg text-slate-600 transition group-hover:text-blue-400">
                  →
                </span>

              </div>


              <p className="text-sm text-slate-400">
                {card.title}
              </p>


              <p className="mt-1 text-2xl font-bold">
                {card.value}
              </p>


              <p className="mt-2 text-xs text-slate-500">
                {card.description}
              </p>

            </button>
          );

        })}

      </div>



      {/* =====================================================
          AGENT DECISION OVERVIEW
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              Agent Decision Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Decisions recorded in the audit trail
            </p>

          </div>

          <Activity
            size={20}
            className="text-slate-600"
          />

        </div>


        <div className="grid gap-4 md:grid-cols-3">


          {/* RESOLVE */}

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-green-500/10 p-2.5 text-green-400">
                <CheckCircle2 size={20} />
              </div>

              <span className="text-xs font-medium text-green-400">
                RESOLVE
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Resolved
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {stats.decision_counts.RESOLVE}
            </p>

          </div>



          {/* FOLLOW UP */}

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-400">
                <HelpCircle size={20} />
              </div>

              <span className="text-xs font-medium text-yellow-400">
                FOLLOW-UP
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              More Information Needed
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {stats.decision_counts.ASK_FOLLOWUP}
            </p>

          </div>



          {/* ESCALATE */}

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-red-500/10 p-2.5 text-red-400">
                <AlertTriangle size={20} />
              </div>

              <span className="text-xs font-medium text-red-400">
                ESCALATE
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Escalated
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {stats.decision_counts.ESCALATE}
            </p>

          </div>

        </div>

      </div>



      {/* =====================================================
          QUICK ACTION
      ===================================================== */}

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div className="flex items-start gap-4">

            <div className="rounded-xl bg-blue-600 p-3">
              <MessageSquare size={22} />
            </div>

            <div>

              <h2 className="font-semibold">
                Need IT assistance?
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Describe your issue and let the AI agent
                determine the appropriate next step.
              </p>

            </div>

          </div>


          <button
            onClick={() => setActivePage("support")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500"
          >
            Open AI Support
          </button>

        </div>

      </div>



      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

        <div className="flex items-center gap-3">

          <span className="h-3 w-3 rounded-full bg-green-400"></span>

          <div>

            <p className="font-medium text-green-400">
              Agent System Operational
            </p>

            <p className="text-sm text-slate-400">
              FastAPI · MongoDB · Groq AI
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


export default App;