
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAssinaturaAtiva(userId: string | undefined) {
  const [assinaturaValida, setAssinaturaValida] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function verificarAssinatura() {
      const hoje = new Date().toISOString();

      const { data, error } = await supabase
        .from("assinaturas")
        .select("*")
        .eq("user_id", userId)
        .gte("valida_ate", hoje)
        .single();

      if (!error && data) setAssinaturaValida(true);
      else setAssinaturaValida(false);

      setCarregando(false);
    }

    verificarAssinatura();
  }, [userId]);

  return { assinaturaValida, carregando };
}
