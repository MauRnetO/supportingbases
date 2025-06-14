import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUsuario(data.user);
      } else {
        router.push("/login");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao seu painel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/agendamentos"
          className="p-6 rounded shadow bg-white hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold mb-2">📅 Agendamentos</h2>
          <p className="text-sm text-gray-600">
            Veja, edite e exclua os agendamentos do dia.
          </p>
        </a>

        <a
          href="/agendamentos/novo"
          className="p-6 rounded shadow bg-white hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold mb-2">➕ Novo Agendamento</h2>
          <p className="text-sm text-gray-600">
            Cadastre um novo cliente e agende seus serviços.
          </p>
        </a>

        <a
          href="/clientes"
          className="p-6 rounded shadow bg-white hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold mb-2">👥 Clientes</h2>
          <p className="text-sm text-gray-600">
            Gerencie os dados e cadastros de clientes.
          </p>
        </a>

        <a
          href="/servicos"
          className="p-6 rounded shadow bg-white hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold mb-2">🛠️ Serviços</h2>
          <p className="text-sm text-gray-600">
            Adicione, edite ou exclua serviços oferecidos.
          </p>
        </a>

        <a
          href="/relatorios"
          className="p-6 rounded shadow bg-white hover:bg-green-100 transition"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Relatórios</h2>
          <p className="text-sm text-gray-600">
            Visualize estatísticas de faturamento e produtividade.
          </p>
        </a>
      </div>
    </div>
  );
}
