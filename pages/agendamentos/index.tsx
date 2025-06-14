import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Cliente {
  id: string;
  nome: string;
}

interface Servico {
  id: string;
  nome: string;
  valor: number;
  duracao_minutos: number;
}

export default function Agendamentos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [mensagem, setMensagem] = useState("");

  const valorTotal = servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.valor, 0);

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setClientes(data);
  }

  async function carregarServicos() {
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setServicos(data);
  }

  async function criarAgendamento() {
    if (!clienteId || !data || !hora || servicosSelecionados.length === 0) {
      setMensagem("Preencha todos os campos e selecione pelo menos um serviço.");
      return;
    }

    const { data: novoAgendamento, error } = await supabase
      .from("agendamentos")
      .insert([{ cliente_id: clienteId, data, hora, valor: valorTotal }])
      .select()
      .single();

    if (error || !novoAgendamento) {
      setMensagem("Erro ao salvar agendamento.");
      return;
    }

    const registros = servicosSelecionados.map((servicoId) => ({
      agendamento_id: novoAgendamento.id,
      servico_id: servicoId,
    }));

    const { error: erroServicos } = await supabase
      .from("agendamentos_servicos")
      .insert(registros);

    if (erroServicos) {
      setMensagem("Agendamento criado, mas houve erro ao vincular os serviços.");
    } else {
      setMensagem("✅ Agendamento salvo com sucesso!");
      setClienteId("");
      setData("");
      setHora("");
      setServicosSelecionados([]);
    }
  }

  useEffect(() => {
    carregarClientes();
    carregarServicos();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Novo Agendamento</h1>

      {mensagem && <p className="text-sm text-blue-600">{mensagem}</p>}

      <select
        className="w-full p-2 border rounded"
        value={clienteId}
        onChange={(e) => setClienteId(e.target.value)}
      >
        <option value="">Selecione o cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700">
        Serviços:
      </label>
      <select
        multiple
        value={servicosSelecionados}
        onChange={(e) =>
          setServicosSelecionados(
            Array.from(e.target.selectedOptions, (opt) => opt.value)
          )
        }
        className="w-full p-2 border rounded h-32"
      >
        {servicos.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nome} — R$ {s.valor.toFixed(2)}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        value={valorTotal > 0 ? `R$ ${valorTotal.toFixed(2)}` : ""}
        readOnly
        className="w-full p-2 border rounded bg-gray-100 text-gray-700"
        placeholder="Valor total"
      />

      <button
        onClick={criarAgendamento}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Salvar Agendamento
      </button>
    </div>
  );
}
