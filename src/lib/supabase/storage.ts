export const evidenceFilesBucket = "evidence-files";

export async function uploadPrivateEvidenceObject({
  contentType,
  fileBytes,
  path,
}: {
  contentType: string;
  fileBytes: ArrayBuffer;
  path: string;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const response = await fetch(
    `${url.replace(/\/$/, "")}/storage/v1/object/${evidenceFilesBucket}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "cache-control": "3600",
        "content-type": contentType,
        "x-upsert": "false",
      },
      body: fileBytes,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase Storage upload failed: ${response.status} ${message}`);
  }

  return { bucket: evidenceFilesBucket, path };
}
