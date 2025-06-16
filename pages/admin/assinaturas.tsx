import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export default function Assinatura() {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUsuarioId(data.user.id);
      } else {
        router.push("/login");
      }
    });
  }, []);

  async function ativarPlano(plano: string) {
    if (!usuarioId) return;

    const { error } = await supabase.from("assinaturas").upsert(
      {
        usuario_id: usuarioId,
        plano,
        ativa: true,
      },
      { onConflict: "usuario_id" } // evita duplicar
    );

    if (error) {
      setMensagem("Erro ao registrar assinatura.");
    } else {
      setMensagem("✅ Assinatura ativada!");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Escolha seu Plano</h1>

        {mensagem && <p className="text-center text-sm text-blue-600 mb-4">{mensagem}</p>}

        <div className="space-y-4">
          <button
            onClick={() => ativarPlano("mensal")}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Plano Mensal - R$ 29,90
          </button>

          <button
            onClick={() => ativarPlano("anual")}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Plano Anual - R$ 249,00
          </button>
        </div>
      </div>
    </div>
  );
}
