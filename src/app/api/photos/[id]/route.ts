import { photoBytes } from "@/lib/photos";

const CUID = /^c[a-z0-9]{20,32}$/;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!CUID.test(id)) return new Response("Nie znaleziono", { status: 404 });

  const size = new URL(request.url).searchParams.get("size") === "thumb" ? "thumb" : "full";
  const bytes = await photoBytes(id, size);
  if (!bytes) return new Response("Nie znaleziono", { status: 404 });

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      // doba, nie rok – usunięte zdjęcie (np. na prośbę ucznia) szybko znika też z cache
      "Cache-Control": "public, max-age=86400",
    },
  });
}
