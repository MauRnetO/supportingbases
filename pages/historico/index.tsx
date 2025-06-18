import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Cliente {
  id: string;
  nome: string;
}

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  servico: string;
  valor: number;
}

export default function Historico() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  async function carregarClientes() {
    const { data, error } = await supabase.from("clientes").select("id, nome").order("nome");
    if (!error && data) setClientes(data);
  }

  async function buscarHistorico() {
    const query = supabase
      .from("agendamentos")
      .select(`
        id,
        data,
        hora,
        valor,
        agendamentos_servicos(servicos(nome))
      `)
      .eq("concluido", true)
      .order("data", { ascending: false });

    if (clienteId) query.eq("cliente_id", clienteId);

    const { data, error } = await query;
    if (!error && data) {
      const agsFormatados = data.map((ag: any) => ({
        id: ag.id,
        data: ag.data,
        hora: ag.hora,
        valor: ag.valor,
        servico: ag.agendamentos_servicos.map((as: any) => as.servicos.nome).join(", "),
      }));
      setAgendamentos(agsFormatados);
    }
  }

  async function excluirAgendamento(id: string) {
    const confirmar = confirm("Tem certeza que deseja excluir este agendamento? Esta ação é permanente.");
    if (!confirmar) return;

    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (!error) {
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } else {
      alert("Erro ao excluir agendamento.");
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Agendamentos</h1>

      <div className="mb-6">
        <select
          className="w-full p-2 border rounded"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Ver todos os clientes</option>
          {clientes.map(cli => (
            <option key={cli.id} value={cli.id}>{cli.nome}</option>
          ))}
        </select>

        <button onClick={buscarHistorico} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
          Buscar Histórico
        </button>
      </div>

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {agendamentos.map(ag => (
            <li key={ag.id} className="border rounded p-3 shadow">
              <div className="font-semibold">{ag.data} às {ag.hora}</div>
              <div className="text-sm text-gray-700">{ag.servico}</div>
              {ag.valor && <div className="text-sm text-green-700 font-semibold">R$ {ag.valor.toFixed(2)}</div>}
              <button
                onClick={() => excluirAgendamento(ag.id)}
                className="mt-2 text-sm text-red-600 underline"
              >
                Excluir definitivamente
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
