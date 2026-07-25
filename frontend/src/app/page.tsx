export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Rock Chick Farm
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fresh baked goods, straight from the farm.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground">
          Order Now
        </button>
        <button className="rounded-full bg-secondary px-5 py-2 font-medium text-secondary-foreground">
          View Menu
        </button>
        <button className="rounded-full bg-secondary-strong px-5 py-2 font-medium text-secondary-strong-foreground">
          Featured Sale
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-primary-strong">
          Golden link text — readable on the cream background.
        </p>
        <p className="text-success">In stock</p>
        <p className="text-error">Sold out</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        {[
          ['background', 'bg-background border border-border'],
          ['primary', 'bg-primary'],
          ['primary-strong', 'bg-primary-strong'],
          ['secondary', 'bg-secondary'],
          ['secondary-strong', 'bg-secondary-strong'],
          ['card', 'bg-card border border-border'],
          ['muted', 'bg-muted'],
          ['success', 'bg-success'],
          ['error', 'bg-error'],
        ].map(([label, cls]) => (
          <div key={label} className="space-y-1">
            <div className={`h-16 w-full rounded-md ${cls}`} />
            <div className="text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
