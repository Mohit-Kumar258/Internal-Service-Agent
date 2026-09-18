import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  ClipboardList,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "support",
      label: "AI Support",
      icon: MessageSquare,
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: Ticket,
    },
    {
      id: "audit",
      label: "Audit Trail",
      icon: ClipboardList,
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      icon: BookOpen,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">

        <div className="rounded-xl bg-blue-600 p-2">
          <ShieldCheck size={23} />
        </div>

        <div>
          <h1 className="font-bold text-white">
            Veridian
          </h1>

          <p className="text-xs text-slate-400">
            IT Support Agent
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}

      </nav>

      {/* Status */}
      <div className="border-t border-slate-800 p-4">

        <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3">

          <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>

          <div>
            <p className="text-sm font-medium text-white">
              System Online
            </p>

            <p className="text-xs text-slate-500">
              Agent operational
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;