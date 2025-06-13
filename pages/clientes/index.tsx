
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  observacoes: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    if (!error && data) setClientes(data);
  }

  async function adicionarCliente() {
    if (!nome || !telefone) return alert("Preencha nome e telefone");
    await supabase.from("clientes").insert([{ nome, telefone, observacoes }]);
    setNome(""); setTelefone(""); setObservacoes("");
    carregarClientes();
  }

  async function excluirCliente(id: string) {
    await supabase.from("clientes").delete().eq("id", id);
    carregarClientes();
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Clientes</h1>

      <div className="mb-6 space-y-2">
        <input type="text" placeholder="Nome" className="w-full p-2 border rounded" value={nome} onChange={e => setNome(e.target.value)} />
        <input type="text" placeholder="Telefone" className="w-full p-2 border rounded" value={telefone} onChange={e => setTelefone(e.target.value)} />
        <textarea placeholder="Observações" className="w-full p-2 border rounded" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
        <button onClick={adicionarCliente} className="bg-blue-600 text-white px-4 py-2 rounded">Adicionar Cliente</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Clientes Cadastrados:</h2>
      <ul className="space-y-2">
        {clientes.map(cliente => (
          <li key={cliente.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <strong>{cliente.nome}</strong> — {cliente.telefone}
              <br /><span className="text-sm text-gray-600">{cliente.observacoes}</span>
            </div>
            <button onClick={() => excluirCliente(cliente.id)} className="text-red-500 text-sm">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
