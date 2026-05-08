import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Dropi Supplier Lab
        </h1>
        <p className="text-lg text-zinc-500 mb-8">
          Entorno experimental para simular el journey de creación y activación de Suppliers. 
          Diseñado para medir fricción, iterar interfaces y validar UX.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/onboarding">
            <Button size="lg" className="px-8 font-semibold">
              Simular Registro
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8 font-semibold">
              Ir al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
