export function SoldOutNotice() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        We&apos;re sold out this week!
      </h1>
      <p className="mt-4 text-muted-foreground">
        Everything on this week&apos;s menu has been claimed. Check back next week for new items.
      </p>
    </main>
  );
}
