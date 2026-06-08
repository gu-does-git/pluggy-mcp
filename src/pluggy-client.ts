const CLIENT_ID = process.env.PLUGGY_CLIENT_ID;
const CLIENT_SECRET = process.env.PLUGGY_CLIENT_SECRET;
const BASE_URL = process.env.PLUGGY_API_BASE ?? "https://api.pluggy.ai";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "[pluggy-mcp] missing PLUGGY_CLIENT_ID or PLUGGY_CLIENT_SECRET — refusing to start."
  );
  process.exit(1);
}

interface CachedKey {
  apiKey: string;
  expiresAt: number;
}

let cachedKey: CachedKey | null = null;

async function mintApiKey(): Promise<CachedKey> {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pluggy /auth ${res.status}: ${body}`);
  }

  const json = (await res.json()) as {
    apiKey: string;
    expiresAt?: string;
  };
  const expiresAt = json.expiresAt
    ? new Date(json.expiresAt).getTime()
    : Date.now() + 2 * 60 * 60 * 1000; // 2h default

  return { apiKey: json.apiKey, expiresAt };
}

async function getApiKey(forceRefresh = false): Promise<string> {
  if (
    !forceRefresh &&
    cachedKey &&
    cachedKey.expiresAt - Date.now() > 60_000
  ) {
    return cachedKey.apiKey;
  }
  cachedKey = await mintApiKey();
  return cachedKey.apiKey;
}

interface PluggyRequestOptions {
  query?: Record<string, unknown>;
  body?: unknown;
}

interface PluggyResponse {
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

async function pluggyRequest(
  method: string,
  path: string,
  options: PluggyRequestOptions = {}
): Promise<PluggyResponse> {
  const url = new URL(`${BASE_URL}${path}`);

  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const bodyStr =
    options.body !== undefined ? JSON.stringify(options.body) : undefined;

  const doFetch = async (apiKey: string) =>
    fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: bodyStr,
    });

  let apiKey = await getApiKey();
  let res = await doFetch(apiKey);

  if (res.status === 401 || res.status === 403) {
    // refresh + retry once
    apiKey = await getApiKey(true);
    res = await doFetch(apiKey);
  }

  let data: unknown;
  const text = await res.text();

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error:
        typeof data === "string"
          ? data
          : JSON.stringify(data),
    };
  }

  return { ok: true, status: res.status, data };
}

function ok(result: PluggyResponse) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

export { pluggyRequest, ok };
