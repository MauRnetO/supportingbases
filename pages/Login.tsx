import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function entrar() {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      alert("Login inválido: " + error.message);
    } else {
      router.push("/agenda");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-1">SupportingBases</h1>
        <p className="text-sm text-center text-gray-600 mb-6">Sistema de agendamentos profissionais</p>

        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border rounded mb-4"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={entrar}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Não tem conta?{" "}
          <a
            href="/cadastros"
            className="text-green-700 font-medium hover:underline"
          >
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}
