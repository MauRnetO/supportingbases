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

export default function CriarAgendamento() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  const valorTotal = servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.valor, 0);

  useEffect(() => {
    supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setClientes(data);
      });

    supabase
      .from("servicos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setServicos(data);
      });
  }, []);

  useEffect(() => {
    if (!data) return;

    supabase
      .rpc("listar_agenda_com_duracao", { data_input: data })
      .then(({ data }) => {
        if (!data) return;
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

        const todos: string[] = [];
        for (let i = 8 * 60; i <= 20 * 60; i += 30) {
          const hr = String(Math.floor(i / 60)).padStart(2, "0");
          const min = String(i % 60).padStart(2, "0");
          todos.push(`${hr}:${min}`);
        }

        const livres = todos.filter((h) => !ocupadas.includes(h));
        setHorariosDisponiveis(livres);
      });
  }, [data]);

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

      <fieldset className="border p-2 rounded">
        <legend className="text-sm font-medium text-gray-700 mb-1">
          Selecione os serviços:
        </legend>
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {servicos.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={s.id}
                checked={servicosSelecionados.includes(s.id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setServicosSelecionados((prev) =>
                    checked
                      ? [...prev, s.id]
                      : prev.filter((id) => id !== s.id)
                  );
                }}
              />
              {s.nome} — R$ {s.valor.toFixed(2)}
            </label>
          ))}
        </div>
      </fieldset>

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Selecione o horário</option>
        {horariosDisponiveis.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

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
