// Wspólne dla przeglądarki (zmniejszanie przed wysłaniem) i serwera (walidacja)
export const PHOTO = {
  maxEdge: 2000,
  quality: 0.85,
  thumbEdge: 640,
  thumbQuality: 0.8,
  maxBytes: 3 * 1024 * 1024,
  maxThumbBytes: 400 * 1024,
  // baza ma ograniczone miejsce – ok. 300 zdjęć po ~0,5 MB to bezpieczny zapas
  limit: 300,
  captionMax: 140,
} as const;

export const photoUrl = (id: string, size: "full" | "thumb" = "full") => `/api/photos/${id}${size === "thumb" ? "?size=thumb" : ""}`;
