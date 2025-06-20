import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";
import { enviarCodigoVerificacao } from "../lib/email";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  function gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  }

  async function registrarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      setCarregando(false);
      return;
    }

    // Cria usuário com senha, mas sem exigir verificação por e-mail
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: false,
    });

    if (userError) {
      setMensagem(userError.message);
      setCarregando(false);
      return;
    }

    // Gera código e salva no localStorage temporariamente
    const codigo = gerarCodigo();
    localStorage.setItem(`codigo_verificacao_${email}`, codigo);
    localStorage.setItem(`senha_cadastro_${email}`, senha); // facilita o login no passo seguinte

    const envio = await enviarCodigoVerificacao(email, codigo);

    if (!envio.sucesso) {
      setMensagem("Erro ao enviar código: " + envio.erro);
      setCarregando(false);
      return;
    }

    router.push({
      pathname: "/verificar",
      query: { email },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={registrarUsuario} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Criar Conta</h1>

        {mensagem && <p className="text-red-600 mb-2 text-sm text-center">{mensagem}</p>}

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Confirme a senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={carregando}
        >
          {carregando ? "Enviando..." : "Enviar Código de Verificação"}
        </button>
      </form>
    </div>
  );
}
