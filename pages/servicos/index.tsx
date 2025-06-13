
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Servico {
  id: string;
  nome: string;
  duracao_minutos: number;
  valor: number;
}

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [valor, setValor] = useState("");

  async function carregarServicos() {
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setServicos(data);
  }

  async function adicionarServico() {
    if (!nome || !duracao || !valor) return alert("Preencha todos os campos.");
    await supabase.from("servicos").insert([
      {
        nome,
        duracao_minutos: parseInt(duracao),
        valor: parseFloat(valor),
      },
    ]);
    setNome(""); setDuracao(""); setValor("");
    carregarServicos();
  }

  async function excluirServico(id: string) {
    await supabase.from("servicos").delete().eq("id", id);
    carregarServicos();
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Serviços Cadastrados</h1>

      <div className="space-y-2 mb-6">
        <input type="text" placeholder="Nome do serviço" className="w-full p-2 border rounded"
          value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="number" placeholder="Duração (minutos)" className="w-full p-2 border rounded"
          value={duracao} onChange={(e) => setDuracao(e.target.value)} />
        <input type="number" placeholder="Valor (R$)" className="w-full p-2 border rounded"
          value={valor} onChange={(e) => setValor(e.target.value)} />
        <button onClick={adicionarServico} className="bg-blue-600 text-white px-4 py-2 rounded">Adicionar Serviço</button>
      </div>

      <ul className="space-y-3">
        {servicos.map(s => (
          <li key={s.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <strong>{s.nome}</strong><br />
              <span className="text-sm text-gray-600">{s.duracao_minutos} min — R$ {s.valor.toFixed(2)}</span>
            </div>
            <button onClick={() => excluirServico(s.id)} className="text-red-500 text-sm">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
