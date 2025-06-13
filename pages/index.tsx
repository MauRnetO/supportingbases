
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/agenda");
  }, [router]);

  return (
    <div className="p-4 text-center">
      <p>Redirecionando para a agenda...</p>
    </div>
  );
}
