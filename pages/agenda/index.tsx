import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  valor: number;
  nome_cliente: string;
  servicos: string; // agora será uma string com os nomes concatenados
}

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  async function carregarAgenda() {
    const { data, error } = await supabase.rpc("listar_agenda_com_multiplos_servicos", {
      data_input: dataSelecionada,
    });

    if (error) {
      console.error("Erro ao carregar agendamentos:", error.message);
    } else if (data) {
      setAgendamentos(data);
    }
  }

  useEffect(() => {
    carregarAgenda();
  }, [dataSelecionada]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agenda do Dia</h1>

      <input
        type="date"
        value={dataSelecionada}
        onChange={(e) => setDataSelecionada(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento para esta data.</p>
      ) : (
        <ul className="space-y-3">
          {agendamentos.map((ag) => (
            <li key={ag.id} className="border rounded p-3 shadow flex flex-col gap-2">
              <div className="font-semibold text-lg">
                {ag.hora} — {ag.nome_cliente || "Cliente não encontrado"}
              </div>
              <div className="text-sm text-gray-700">{ag.servicos}</div>
              {typeof ag.valor === "number" && (
                <div className="text-sm text-green-700 font-semibold">
                  R$ {ag.valor.toFixed(2)}
                </div>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Olá ${ag.nome_cliente || ""}, lembrando seu horário para dia ${dataSelecionada} às ${ag.hora}. Serviços: ${ag.servicos}. Qualquer dúvida estou à disposição! 😉`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-sm text-blue-600 underline"
                title="Enviar lembrete no WhatsApp"
              >
                Enviar lembrete por WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
