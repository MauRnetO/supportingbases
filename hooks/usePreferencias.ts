import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export interface Preferencias {
  nome_marca: string;
  tema: string;
  cor_principal: string;
}

export function usePreferencias() {
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null);

  useEffect(() => {
    async function carregar() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("preferencias")
        .select("*")
        .eq("usuario_id", user.id)
        .single();

      if (error) {
        // Se não existe ainda, cria com valores padrão
        await supabase.from("preferencias").insert([
          {
            usuario_id: user.id,
            nome_marca: "MinhaAgenda",
            tema: "claro",
            cor_principal: "#16a34a",
          },
        ]);
        setPreferencias({
          nome_marca: "MinhaAgenda",
          tema: "claro",
          cor_principal: "#16a34a",
        });
      } else {
        setPreferencias(data);
      }
    }

    carregar();
  }, []);

  return preferencias;
}
