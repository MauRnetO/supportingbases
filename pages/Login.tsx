import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem("Erro ao fazer login: " + error.message);
    } else {
      setMensagem("✅ Login realizado com sucesso!");
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Entrar
        </button>
        <p className="text-sm text-center">
          Ainda não tem conta?{" "}
          <a href="/cadastro" className="text-blue-600 underline">
            Criar conta
          </a>
        </p>
        {mensagem && <p className="text-sm text-center text-red-600">{mensagem}</p>}
      </div>
    </div>
  );
}
