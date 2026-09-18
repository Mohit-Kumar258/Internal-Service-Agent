import { useState } from "react";
import axios from "axios";

import {
  Send,
  Bot,
  User,
  Ticket,
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";


const demoScenarios = [
  {
    label: "Guest Wi-Fi",
    type: "RESOLVE",
    name: "Vikram Chawla",
    email: "vikram.chawla@veridian-corp.example",
    message:
      "Can I get Wi-Fi access for a guest visiting our office tomorrow?",
  },
  {
    label: "Admin Access",
    type: "ESCALATE",
    name: "Kavya Pillai",
    email: "kavya.pillai@veridian-corp.example",
    message:
      "Can someone give me admin access to the finance reporting server? Need it urgently for month-end.",
  },
  {
    label: "Phishing",
    type: "ESCALATE",
    name: "Ananya Reddy",
    email: "ananya.reddy@veridian-corp.example",
    message:
      "I think I got a phishing email asking for my login. What should I do?",
  },
  {
    label: "Vague Request",
    type: "FOLLOW-UP",
    name: "Rahul Menon",
    email: "rahul.menon@veridian-corp.example",
    message: "hey can you help, its not working",
  },
];


function AISupport() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const loadScenario = (scenario) => {
    setName(scenario.name);
    setEmail(scenario.email);
    setMessage(scenario.message);
    setResult(null);
  };


  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setResult(null);
  };


  const sendMessage = async () => {

    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {

      const response = await axios.post(
        "https://veridian-it-backend-nine.vercel.app/api/chat",
        {
          message,
          employee_name: name,
          employee_email: email,
        }
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      setResult({
        decision: "ERROR",
        response:
          "Unable to connect to the IT support agent. Please verify that the backend is running.",
        sources: [],
        reason: "Backend connection failed.",
      });

    } finally {

      setLoading(false);

    }
  };


  const decisionConfig = {

    RESOLVE: {
      label: "Resolved",
      icon: CheckCircle2,
      color:
        "border-green-500/30 bg-green-500/10 text-green-300",
    },

    ESCALATE: {
      label: "Escalation Required",
      icon: AlertTriangle,
      color:
        "border-red-500/30 bg-red-500/10 text-red-300",
    },

    ASK_FOLLOWUP: {
      label: "More Information Needed",
      icon: HelpCircle,
      color:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    },

    ERROR: {
      label: "System Error",
      icon: AlertTriangle,
      color:
        "border-red-500/30 bg-red-500/10 text-red-300",
    },

  };


  const decision =
    result && decisionConfig[result.decision]
      ? decisionConfig[result.decision]
      : null;


  return (
    <div className="space-y-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
            <Sparkles size={16} />
            AI-POWERED SUPPORT
          </div>

          <h1 className="text-3xl font-bold">
            Internal IT Assistant
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            Describe an employee IT issue and the agent will retrieve
            relevant company policy, determine the appropriate decision,
            and escalate requests when required.
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">

          <ShieldCheck
            size={18}
            className="text-green-400"
          />

          <div>

            <p className="text-xs font-medium text-white">
              Grounded Agent
            </p>

            <p className="text-[11px] text-slate-500">
              Policy-aware responses
            </p>

          </div>

        </div>

      </div>



      {/* =====================================================
          DEMO SCENARIOS
      ===================================================== */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="font-semibold">
              Quick Demo Scenarios
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Preloaded cases for demonstrating different agent decisions.
            </p>

          </div>

          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] text-slate-400">
            4 scenarios
          </span>

        </div>


        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {demoScenarios.map((scenario) => (

            <button
              key={scenario.label}
              onClick={() => loadScenario(scenario)}
              className="group rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-slate-800"
            >

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-medium text-white">
                  {scenario.label}
                </span>

                <span
                  className={`h-2 w-2 rounded-full ${
                    scenario.type === "RESOLVE"
                      ? "bg-green-400"
                      : scenario.type === "ESCALATE"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                />

              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                {scenario.message}
              </p>

            </button>

          ))}

        </div>

      </section>



      {/* =====================================================
          REQUEST WORKSPACE
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-5">


        {/* LEFT - REQUEST */}
        <section className="xl:col-span-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <User size={21} />
              </div>

              <div>

                <h2 className="font-semibold">
                  Employee Request
                </h2>

                <p className="text-xs text-slate-500">
                  Provide the request details for the agent.
                </p>

              </div>

            </div>


            {result && (
              <button
                onClick={resetForm}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                <RotateCcw size={13} />
                New Request
              </button>
            )}

          </div>


          {/* Employee fields */}

          <div className="grid gap-4 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Employee Name
              </label>

              <input
                type="text"
                placeholder="e.g. Vikram Chawla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />

            </div>


            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Employee Email
              </label>

              <input
                type="email"
                placeholder="employee@veridian-corp.example"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />

            </div>

          </div>


          {/* Request */}

          <div className="mt-5">

            <label className="mb-2 block text-xs font-medium text-slate-400">
              IT Issue / Request
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the employee's IT issue..."
              rows="7"
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />

          </div>


          {/* Send */}

          <div className="mt-4 flex items-center justify-between">

            <p className="text-xs text-slate-600">
              Agent uses supplied Veridian policies only.
            </p>

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Analyze Request
                </>
              )}

            </button>

          </div>

        </section>



        {/* RIGHT - HOW AGENT WORKS */}

        <section className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
              <Bot size={21} />
            </div>

            <div>

              <h2 className="font-semibold">
                Agent Workflow
              </h2>

              <p className="text-xs text-slate-500">
                How the request is processed
              </p>

            </div>

          </div>


          <div className="space-y-5">

            {[
              ["01", "Understand", "Analyze the employee's request"],
              ["02", "Retrieve", "Find relevant supplied policy"],
              ["03", "Decide", "Resolve, ask, or escalate"],
              ["04", "Record", "Create audit trail and ticket when required"],
            ].map(([number, title, description]) => (

              <div
                key={number}
                className="flex gap-4"
              >

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-blue-400">
                  {number}
                </div>

                <div>

                  <p className="text-sm font-medium text-white">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {description}
                  </p>

                </div>

              </div>

            ))}

          </div>


          <div className="mt-7 rounded-xl border border-slate-800 bg-slate-950 p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-green-400"
              />

              <div>

                <p className="text-xs font-medium text-green-400">
                  Grounding & Safety
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  The agent is instructed not to invent policies,
                  approvals, actions, or ticket information.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>



      {/* =====================================================
          RESULT
      ===================================================== */}

      {result && (

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          {/* Result header */}

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Bot size={22} />
              </div>

              <div>

                <h2 className="font-semibold">
                  Agent Analysis
                </h2>

                <p className="text-xs text-slate-500">
                  Decision, evidence, and execution details
                </p>

              </div>

            </div>


            {decision && (

              <div
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${decision.color}`}
              >

                <decision.icon size={17} />

                {decision.label}

              </div>

            )}

          </div>



          {/* Result grid */}

          <div className="grid gap-5 lg:grid-cols-2">


            {/* RESPONSE */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="mb-3 flex items-center gap-2">

                <Bot
                  size={16}
                  className="text-blue-400"
                />

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Response to Employee
                </p>

              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {result.response}
              </p>

            </div>



            {/* REASON */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="mb-3 flex items-center gap-2">

                <ActivityIcon />

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Decision Reason
                </p>

              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {result.reason}
              </p>

            </div>



            {/* SOURCES */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="mb-3 flex items-center gap-2">

                <FileText
                  size={16}
                  className="text-blue-400"
                />

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Knowledge Source
                </p>

              </div>


              {result.sources?.length ? (

                <div className="flex flex-wrap gap-2">

                  {result.sources.map((source) => (

                    <span
                      key={source}
                      className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300"
                    >
                      {source}
                    </span>

                  ))}

                </div>

              ) : (

                <p className="text-sm text-slate-600">
                  No direct policy source
                </p>

              )}

            </div>



            {/* AUDIT */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="mb-3 flex items-center gap-2">

                <Clock
                  size={16}
                  className="text-blue-400"
                />

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Audit Trail
                </p>

              </div>


              {result.audit_id ? (

                <div>

                  <p className="text-xs text-slate-500">
                    Interaction recorded successfully
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-slate-400">
                    {result.audit_id}
                  </p>

                </div>

              ) : (

                <p className="text-sm text-slate-600">
                  No audit record returned
                </p>

              )}

            </div>

          </div>



          {/* FOLLOW UP */}

          {result.follow_up_question && (

            <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">

              <div className="flex gap-3">

                <HelpCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-yellow-400"
                />

                <div>

                  <p className="font-semibold text-yellow-300">
                    Follow-up Required
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {result.follow_up_question}
                  </p>

                </div>

              </div>

            </div>

          )}



          {/* ESCALATION TICKET */}

          {result.ticket && (

            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/5 p-5">

              <div className="mb-5 flex items-center gap-3">

                <div className="rounded-lg bg-red-500/10 p-2.5 text-red-400">
                  <Ticket size={19} />
                </div>

                <div>

                  <h3 className="font-semibold text-red-300">
                    Escalation Ticket Created
                  </h3>

                  <p className="text-xs text-slate-500">
                    The request requires additional review.
                  </p>

                </div>

              </div>


              <div className="grid gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Ticket ID
                  </p>

                  <p className="mt-2 font-mono font-semibold text-white">
                    {result.ticket.id}
                  </p>

                </div>


                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="mt-2 font-semibold text-red-300">
                    {result.ticket.status}
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>

      )}

    </div>
  );
}


/* Small reusable icon */
function ActivityIcon() {
  return (
    <div className="h-4 w-4 rounded-full border-2 border-purple-400" />
  );
}


export default AISupport;