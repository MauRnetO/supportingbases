import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Home, Calendar, Users, Settings, Menu, X } from "lucide-react";

const menu = [
  { label: "Início", href: "/dashboard", icon: <Home size={18} /> },
  { label: "Agendamentos", href: "/agendamentos", icon: <Calendar size={18} /> },
  { label: "Novo Agendamento", href: "/agendamentos/novo", icon: <Calendar size={18} /> },
  { label: "Histórico", href: "/historico", icon: <ClipboardList size={28} /> },
  { label: "Clientes", href: "/clientes", icon: <Users size={18} /> },
  { label: "Serviços", href: "/servicos", icon: <Settings size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarAberto, setSidebarAberto] = useState(false);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Botão de menu para mobile */}

      {!sidebarAberto && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 text-gray-700"
          onClick={() => setSidebarAberto(true)}
        >
      <Menu size={28} />
    </button>
  )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col transform transition-transform duration-300
          ${sidebarAberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-green-600">MinhaAgenda</h2>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setSidebarAberto(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 p-2 rounded hover:bg-green-100 transition ${
                router.pathname.startsWith(item.href) ? "bg-green-100 font-semibold" : ""
              }`}
              onClick={() => setSidebarAberto(false)} // Fecha no mobile após clique
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={sair}
          className="mt-4 text-sm text-red-600 underline hover:text-red-800"
        >
          Sair da conta
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-64">{children}</main>
    </div>
  );
}
