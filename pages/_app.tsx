import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const rotasPublicas = ["/Login", "/cadastros", "/assinatura"];

  useEffect(() => {
    async function validarSessao() {
      console.log("🔍 Verificando sessão...");

      const { data: sessionData } = await supabase.auth.getSession();
      let sessao = sessionData.session;

      if (!sessao) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (!rotasPublicas.includes(router.pathname)) {
            console.warn("⚠️ Sem sessão. Redirecionando para /Login");
            router.replace("/Login");
          }
          setLoading(false);
          return;
        }
        sessao = { user: userData.user } as any; // cria sessão manualmente com user
      }

      const user = sessao.user;

      const { data: assinatura, error } = await supabase
        .from("assinaturas")
        .select("plano, ativo")
        .eq("usuario_id", user.id)
        .single();

      if (error) console.error("❌ Erro ao buscar assinatura:", error);
      console.log("🧾 Assinatura:", assinatura);

      if (!assinatura) {
        router.replace("/assinatura");
        return;
      }

      const { plano, ativo } = assinatura;

      if (plano === "admin" && router.pathname === "/assinatura") {
        console.log("✅ Admin logado, redirecionando para /dashboard");
        router.replace("/dashboard");
        return;
      }

      if (!ativo && plano !== "admin" && router.pathname !== "/assinatura") {
        console.log("🔒 Assinatura inativa. Redirecionando para /assinatura");
        router.replace("/assinatura");
        return;
      }

      if (router.pathname === "/Login") {
        router.replace("/dashboard");
        return;
      }

      setSession(sessao);
      setLoading(false);
    }

    validarSessao();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sessao) => {
      console.log("🔄 Mudança na sessão:", sessao);
      setSession(sessao);
      validarSessao();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando sessão...</p>
      </div>
    );
  }

  if (["/Login", "/cadastro", "/cadastros", "/assinatura"].includes(router.pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
