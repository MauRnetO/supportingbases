import { Calendar, ClipboardList, Users, Settings } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao seu painel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Calendário"
          description="Visualizar dias disponíveis para agendamento"
          href="/agenda"
          icon={<ClipboardList size={28} />}
        />

        <Card
          title="Agendamentos"
          description="Veja, edite e exclua os agendamentos do dia."
          href="/agendamentos"
          icon={<Calendar size={28} />}
        />

        <Card
          title="Novo Agendamento"
          description="Cadastre um novo cliente e agende seus serviços."
          href="/agendamentos/novo"
          icon={<ClipboardList size={28} />}
        />

        <Card
          title="Clientes"
          description="Gerencie os dados e cadastros de clientes."
          href="/clientes"
          icon={<Users size={28} />}
        />

        <Card
          title="Serviços"
          description="Adicione, edite ou exclua serviços oferecidos."
          href="/servicos"
          icon={<Settings size={28} />}
        />

        <Card
          title="Histórico"
          description="Visualize estatísticas de faturamento e produtividade."
          href="/historico"
          icon={<ClipboardList size={28} />}
        />
      </div>
    </div>
  );
}

function Card({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer h-full flex flex-col gap-2">
        <div className="text-green-600">{icon}</div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}