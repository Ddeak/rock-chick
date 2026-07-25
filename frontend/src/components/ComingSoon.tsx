export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-4 text-muted-foreground">Coming soon...</p>
    </main>
  );
}
