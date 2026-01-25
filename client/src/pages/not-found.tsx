import { Link } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Pagina non trovata</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()} variant="outline" data-testid="button-go-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna Indietro
          </Button>
          <Link href="/">
            <Button data-testid="button-go-home">
              <Home className="mr-2 h-4 w-4" />
              Vai alla Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
