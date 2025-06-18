import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

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

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editObs, setEditObs] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setClientes(data);
  }

  async function adicionarCliente() {
    if (!nome || !telefone) return alert("Preencha nome e telefone");
    await supabase.from("clientes").insert([{ nome, telefone, observacoes }]);
    setNome("");
    setTelefone("");
    setObservacoes("");
    carregarClientes();
  }

  async function excluirCliente(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    await supabase.from("clientes").delete().eq("id", id);
    carregarClientes();
  }

  async function salvarEdicao(id: string) {
    await supabase
      .from("clientes")
      .update({ nome: editNome, telefone: editTelefone, observacoes: editObs })
      .eq("id", id);
    setEditandoId(null);
    carregarClientes();
  }

  function iniciarEdicao(cliente: Cliente) {
    setEditandoId(cliente.id);
    setEditNome(cliente.nome);
    setEditTelefone(cliente.telefone);
    setEditObs(cliente.observacoes);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Clientes</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 border rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          className="w-full p-2 border rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <textarea
          placeholder="Observações"
          className="w-full p-2 border rounded"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
        <button
          onClick={adicionarCliente}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar Cliente
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Clientes Cadastrados:</h2>
      <ul className="space-y-2">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="border p-3 rounded">
            {editandoId === cliente.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editTelefone}
                  onChange={(e) => setEditTelefone(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => salvarEdicao(cliente.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="text-gray-500 underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{cliente.nome}</strong> — {cliente.telefone}
                  <br />
                  <span className="text-sm text-gray-600">
                    {cliente.observacoes}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => iniciarEdicao(cliente)}
                    className="text-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirCliente(cliente.id)}
                    className="text-red-500 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
