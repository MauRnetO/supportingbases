import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  valor: number;
  nome_cliente: string;
  servicos: string;
}

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
 

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  function gerarIntervalos(minutos: number) {
    const inicio = 8 * 60; // 08:00
    const fim = 20 * 60;   // 20:00
    const horarios: string[] = [];

    for (let i = inicio; i <= fim; i += minutos) {
      const h = String(Math.floor(i / 60)).padStart(2, "0");
      const m = String(i % 60).padStart(2, "0");
      horarios.push(`${h}:${m}`);
    }

    return horarios;
  }

  async function carregarHorariosDisponiveis() {
    const { data, error } = await supabase.rpc("listar_agenda_com_duracao", {
      data_input: dataSelecionada,
    });

    if (error || !data) return;

    // Cada item deve conter { hora, duracao_total }
    const ocupados: { hora: string; duracao_total: number }[] = data;

    const ocupadas: string[] = [];
    ocupados.forEach(({ hora, duracao_total }) => {
      const [h, m] = hora.split(":").map(Number);
      const inicioMin = h * 60 + m;
      const blocos = Math.ceil(duracao_total / 30);

      for (let i = 0; i < blocos; i++) {
        const totalMin = inicioMin + i * 30;
        const hr = String(Math.floor(totalMin / 60)).padStart(2, "0");
        const min = String(totalMin % 60).padStart(2, "0");
        ocupadas.push(`${hr}:${min}`);
      }
    });

    const todos = gerarIntervalos(30);
    const livres = todos.filter((h) => !ocupadas.includes(h));
    setHorariosDisponiveis(livres);
  }

  // Chamar isso sempre que mudar a data
  useEffect(() => {
    if (dataSelecionada) carregarHorariosDisponiveis();
  }, [dataSelecionada]);


  async function carregarAgenda() {
    setCarregando(true);
    const { data, error } = await supabase.rpc("listar_agenda_com_multiplos_servicos", {
      data_input: dataSelecionada,
    });

    if (error) {
      console.error("Erro ao carregar agendamentos:", error.message);
      setErro("Erro ao carregar agendamentos.");
    } else {
      setAgendamentos(data || []);
    }

    setCarregando(false);
  }

  async function excluirAgendamento(id: string) {
    if (!confirm("Deseja realmente excluir este agendamento?")) return;

    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir.");
    } else {
      setAgendamentos((prev) => prev.filter((ag) => ag.id !== id));
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

      {carregando ? (
        <p>Carregando...</p>
      ) : agendamentos.length === 0 ? (
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

              <div className="flex gap-4 mt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Olá ${ag.nome_cliente || ""}, lembrando seu horário para dia ${dataSelecionada} às ${ag.hora}. Serviços: ${ag.servicos}. Qualquer dúvida estou à disposição! 😉`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Enviar WhatsApp
                </a>

                <button
                  onClick={() => excluirAgendamento(ag.id)}
                  className="text-sm text-red-600 underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
