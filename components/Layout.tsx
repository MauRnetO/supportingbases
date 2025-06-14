import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";
import { Home, Calendar, Users, Settings, LogOut } from "lucide-react";

const menu = [
  { label: "Início", href: "/", icon: <Home size={18} /> },
  { label: "Agenda", href: "/agenda", icon: <Calendar size={18} /> },
  { label: "Agendamentos", href: "/agendamentos/novo", icon: <Calendar size={18} /> },
  { label: "Clientes", href: "/clientes", icon: <Users size={18} /> },
  { label: "Serviços", href: "/servicos", icon: <Settings size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Lateral */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-green-600 mb-8">MinhaAgenda</h2>
        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 p-2 rounded hover:bg-green-100 transition ${
                router.pathname === item.href ? "bg-green-100 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={sair}
          className="mt-6 flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}