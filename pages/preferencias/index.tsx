import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Preferencias() {
  const [nomeMarca, setNomeMarca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarPreferencias() {
      const { data: usuario } = await supabase.auth.getUser();
      const userId = usuario.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("preferencias")
        .select("*")
        .eq("usuario_id", userId)
        .single();

      if (!error && data) {
        setNomeMarca(data.nome_marca || "");
      }
    }

    carregarPreferencias();
  }, []);

  async function salvarPreferencias() {
    setCarregando(true);
    setMensagem("");

    const { data: usuario } = await supabase.auth.getUser();
    const userId = usuario.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("preferencias")
      .upsert({ usuario_id: userId, nome_marca: nomeMarca });

    if (error) {
      setMensagem("Erro ao salvar preferências.");
    } else {
      setMensagem("Preferências salvas com sucesso!");
    }

    setCarregando(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Preferências da Conta</h1>

      <label className="block mb-2 font-semibold">Nome da Marca</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={nomeMarca}
        onChange={(e) => setNomeMarca(e.target.value)}
      />

      <button
        onClick={salvarPreferencias}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={carregando}
      >
        {carregando ? "Salvando..." : "Salvar Preferências"}
      </button>

      {mensagem && <p className="mt-4 text-sm">{mensagem}</p>}
    </div>
  );
}
