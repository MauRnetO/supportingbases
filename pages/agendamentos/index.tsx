
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Cliente {
  id: string;
  nome: string;
}

export default function Agendamentos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase.from("clientes").select("id, nome").order("nome");
    if (!error && data) setClientes(data);
  }

  async function agendar() {
    if (!clienteId || !data || !hora || !servico) return alert("Preencha todos os campos");
    await supabase.from("agendamentos").insert([{
      cliente_id: clienteId,
      data,
      hora,
      servico,
      valor
    }]);
    setClienteId(""); setData(""); setHora(""); setServico(""); setValor("");
    alert("Agendamento realizado!");
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Agendamento</h1>

      <div className="space-y-3">
        <select className="w-full p-2 border rounded" value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">Selecione um cliente</option>
          {clientes.map(cli => (
            <option key={cli.id} value={cli.id}>{cli.nome}</option>
          ))}
        </select>
        <input type="date" className="w-full p-2 border rounded" value={data} onChange={e => setData(e.target.value)} />
        <input type="time" className="w-full p-2 border rounded" value={hora} onChange={e => setHora(e.target.value)} />
        <input type="text" placeholder="Serviço" className="w-full p-2 border rounded" value={servico} onChange={e => setServico(e.target.value)} />
        <input type="number" placeholder="Valor (opcional)" className="w-full p-2 border rounded" value={valor} onChange={e => setValor(e.target.value)} />
        <button onClick={agendar} className="bg-green-600 text-white px-4 py-2 rounded">Agendar</button>
      </div>
    </div>
  );
}
