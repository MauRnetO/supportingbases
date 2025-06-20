// lib/email.ts
import { Resend } from "resend";

const resend = new Resend("re_VjaLSvz8_7GpJvn4TEQ6vfAcyVcQcs5Au");

export async function enviarCodigoVerificacao(destinatario: string, codigo: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "supportingbases@resend.dev",
      to: destinatario,
      subject: "Código de Verificação - SupportingBases",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 24px;">
          <h2 style="color: #10B981;">Código de Verificação</h2>
          <p>Use o código abaixo para confirmar seu cadastro na plataforma SupportingBases:</p>
          <div style="font-size: 36px; font-weight: bold; margin: 20px 0; color: #111827;">${codigo}</div>
          <p style="font-size: 14px; color: #6B7280;">O código expira em poucos minutos. Não compartilhe com ninguém.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Falha ao enviar e-mail:", error);
      return { sucesso: false, erro: error.message };
    }

    console.log("📧 Código enviado com sucesso:", data);
    return { sucesso: true };
  } catch (err: any) {
    console.error("❌ Erro inesperado ao enviar código:", err);
    return { sucesso: false, erro: err.message || "Erro desconhecido" };
  }
}
