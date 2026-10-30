const KEY = "raj-favourites";

export function readFavourites() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function writeFavourites(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("favourites:changed"));
}

export function toggleFavourite(id: string) {
  const current = readFavourites();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeFavourites(next);
  return next.includes(id);
}
