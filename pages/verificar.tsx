import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export default function VerificarEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (router.query.email && router.query.senha) {
      setEmail(router.query.email as string);
      setSenha(router.query.senha as string);
    }
  }, [router.query]);

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: codigo,
      type: "signup",
    });

    if (verifyError) {
      setMensagem("Código inválido ou expirado.");
      return;
    }

    // Após verificar, faz login com e-mail e senha
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (loginError) {
      setMensagem("Erro ao entrar após validação.");
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={verificarCodigo} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Verificar E-mail</h1>

        {mensagem && <p className="text-red-600 text-sm mb-2 text-center">{mensagem}</p>}

        <p className="text-sm text-gray-700 mb-3 text-center">
          Um código foi enviado para <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Código recebido"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Confirmar
        </button>
      </form>
    </div>
  );
}
