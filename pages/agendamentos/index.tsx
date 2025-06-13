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
  const [servicoId, setServicoId] = useState("");
  const [valor, setValor] = useState<number | null>(null);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    if (!error && data) setClientes(data);
  }

  async function carregarServicos() {
    const { data, error } = await supabase.from("servicos").select("*").order("created_at", { ascending: false });
    if (!error && data) setServicos(data);
  }

  async function criarAgendamento() {
    if (!clienteId || !servicoId || !data || !hora) {
      alert("Preencha todos os campos.");
      return;
    }

    const servicoSelecionado = servicos.find(s => s.id === servicoId);
    if (!servicoSelecionado) return;

    await supabase.from("agendamentos").insert([
      {
        cliente_id: clienteId,
        servico: servicoSelecionado.nome,
        valor: servicoSelecionado.valor,
        data,
        hora
      }
    ]);

    alert("Agendamento criado!");
    setClienteId("");
    setServicoId("");
    setValor(null);
    setData("");
    setHora("");
  }

  useEffect(() => {
    carregarClientes();
    carregarServicos();
  }, []);

  useEffect(() => {
    const servico = servicos.find(s => s.id === servicoId);
    if (servico) setValor(servico.valor);
  }, [servicoId]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Novo Agendamento</h1>

      <select className="w-full p-2 border rounded" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
        <option value="">Selecione o cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <select className="w-full p-2 border rounded" value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
        <option value="">Selecione o serviço</option>
        {servicos.map((s) => (
          <option key={s.id} value={s.id}>{s.nome} — R$ {s.valor.toFixed(2)}</option>
        ))}
      </select>

      <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full p-2 border rounded" />
      <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full p-2 border rounded" />

      <input
        type="text"
        value={valor !== null ? `R$ ${valor.toFixed(2)}` : ""}
        readOnly
        className="w-full p-2 border rounded bg-gray-100 text-gray-700"
        placeholder="Valor"
      />

      <button onClick={criarAgendamento} className="bg-green-600 text-white px-4 py-2 rounded w-full">Salvar</button>
    </div>
  );
}
