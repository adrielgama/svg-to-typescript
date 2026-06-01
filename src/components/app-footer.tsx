export function AppFooter() {
  return (
    <footer className="border-t bg-background/70">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-muted-foreground lg:px-6">
        Desenvolvido por{" "}
        <a
          href="https://adrielgama.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          adrielgama.dev
        </a>
      </div>
    </footer>
  );
}
