import { del } from "@vercel/blob";

/**
 * Resolve the Vercel Blob read/write token for server-side uploads.
 * Never log or return the token value to clients.
 */
export function getBlobReadWriteToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";

  if (!token) {
    throw new Error(
      "Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN in your environment (Vercel → Storage → Blob).",
    );
  }

  const placeholders = new Set(["[SENSITIVE]", "SENSITIVE", "PLACEHOLDER", "your-token", "vercel_blob_rw_..."]);
  if (placeholders.has(token) || token.toLowerCase().includes("replace-with")) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is still a placeholder. Paste the real token from your Vercel Blob store.",
    );
  }

  // Current Vercel RW tokens use this prefix; reject obvious non-tokens early.
  if (!token.startsWith("vercel_blob_rw_")) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN looks invalid. Expected a Vercel Blob read/write token from your store settings.",
    );
  }

  return token;
}

function isVercelBlobUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".blob.vercel-storage.com") || host.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Best-effort cleanup for Blob-hosted images only.
 * Local `/images` and `/uploads` paths are left alone.
 * Failures are swallowed so deletes never block admin CRUD.
 */
export async function deleteBlobUrls(urls: Array<string | null | undefined>) {
  const targets = [...new Set(urls.filter((url): url is string => Boolean(url && isVercelBlobUrl(url))))];
  if (!targets.length) return;

  let token: string;
  try {
    token = getBlobReadWriteToken();
  } catch {
    return;
  }

  await Promise.all(
    targets.map(async (url) => {
      try {
        await del(url, { token });
      } catch {
        // Ignore missing objects / auth gaps — DB row removal already succeeded or is about to.
      }
    }),
  );
}
