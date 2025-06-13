
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/router";

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
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Entrar</h1>

      <input type="email" placeholder="E-mail" className="w-full p-2 border rounded mb-2" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" className="w-full p-2 border rounded mb-4" value={senha} onChange={e => setSenha(e.target.value)} />

      <button onClick={entrar} className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
    </div>
  );
}
