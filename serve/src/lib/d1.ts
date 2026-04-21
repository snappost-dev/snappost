type CloudflareD1ApiResult<T> = {
  success?: boolean;
  errors?: Array<{ message?: string }>;
  result?: Array<{ results?: T[] }>;
};

export async function queryD1<T>(
  sql: string,
  params: unknown[] = [],
  databaseId: string,
  env: { CF_ACCOUNT_ID: string; CF_API_TOKEN: string }
): Promise<T[]> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/d1/database/${databaseId}/query`;

  try {
    console.log("[d1] request:", { databaseId, sql, params });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql, params })
    });
    console.log("[d1] response status:", response.status);
    const raw = await response.text();
    console.log("[d1] response body:", raw);

    const payload = JSON.parse(raw) as CloudflareD1ApiResult<T>;

    if (!response.ok || payload.success === false) {
      const message =
        payload.errors?.[0]?.message ?? `D1 query failed with status ${response.status}`;
      throw new Error(message);
    }

    return payload.result?.[0]?.results ?? [];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown D1 error";
    throw new Error(message);
  }
}
