import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const rotaPrivada = ["/dashboard", "/agendamentos", "/clientes", "/servicos", "/relatorios"];

  const caminho = req.nextUrl.pathname;

  const precisaAuth = rotaPrivada.some((rota) => caminho.startsWith(rota));

  if (precisaAuth && !session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
