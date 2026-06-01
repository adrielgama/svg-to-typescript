import { Heart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/github-mark";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-none">
            Client-side SVG converter
          </div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            SVG to TypeScript
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Converta SVG em componente React tipado, sem backend.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/30">
            Desenvolvido por{" "}
            <a
              href="https://adrielgama.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/30 underline-offset-4 hover:text-foreground hover:underline"
            >
              adrielgama.dev
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href="https://ko-fi.com/adrielgama"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="h-4 w-4" />
              Doar
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            aria-label="Abrir repositório no GitHub"
            title="GitHub"
            className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href="https://github.com/adrielgama/svg-to-typescript"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubMark className="h-4 w-4" />
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Alternar tema"
            title="Alternar tema"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}
