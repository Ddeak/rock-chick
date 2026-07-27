export async function getStockLevels(uuids: string[]): Promise<Record<string, number>> {
  if (uuids.length === 0) {
    return {};
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/stock?uuids=${uuids.join(',')}`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      return {};
    }
    const data = (await res.json()) as { stock?: Record<string, number> };
    return data.stock ?? {};
  } catch {
    return {};
  }
}
