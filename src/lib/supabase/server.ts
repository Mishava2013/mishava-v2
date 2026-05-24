export type SupabaseFilter = Record<string, string | number | boolean>;

export type SupabaseWriteResult<T> = {
  data: T[];
  status: number;
};

export type SupabaseServerClient = {
  insert<T extends Record<string, unknown>>(
    table: string,
    payload: Record<string, unknown>,
  ): Promise<SupabaseWriteResult<T>>;
  update<T extends Record<string, unknown>>(
    table: string,
    filters: SupabaseFilter,
    payload: Record<string, unknown>,
  ): Promise<SupabaseWriteResult<T>>;
  selectMany<T extends Record<string, unknown>>(
    table: string,
    filters?: SupabaseFilter,
    select?: string,
  ): Promise<T[]>;
  selectOne<T extends Record<string, unknown>>(
    table: string,
    filters?: SupabaseFilter,
    select?: string,
  ): Promise<T | null>;
};

export function isSupabaseServerConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY),
  );
}

export function createSupabaseServerClient(): SupabaseServerClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for server workflows.",
    );
  }

  return createSupabaseRestClient({ url, key });
}

export function createSupabaseRestClient({
  url,
  key,
}: {
  url: string;
  key: string;
}): SupabaseServerClient {
  const restUrl = `${url.replace(/\/$/, "")}/rest/v1`;
  const headers = {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };

  async function request<T>(
    table: string,
    init: RequestInit,
    filters?: SupabaseFilter,
    select = "*",
  ): Promise<T[]> {
    const params = new URLSearchParams();
    params.set("select", select);

    for (const [field, value] of Object.entries(filters ?? {})) {
      params.set(field, `eq.${String(value)}`);
    }

    const response = await fetch(`${restUrl}/${table}?${params.toString()}`, {
      ...init,
      headers: {
        ...headers,
        Prefer: "return=representation",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Supabase ${table} request failed: ${response.status} ${message}`);
    }

    if (response.status === 204) {
      return [];
    }

    return (await response.json()) as T[];
  }

  return {
    async insert<T extends Record<string, unknown>>(
      table: string,
      payload: Record<string, unknown>,
    ) {
      const data = await request<T>(table, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return { data, status: 201 };
    },
    async update<T extends Record<string, unknown>>(
      table: string,
      filters: SupabaseFilter,
      payload: Record<string, unknown>,
    ) {
      const data = await request<T>(
        table,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        filters,
      );
      return { data, status: 200 };
    },
    async selectMany<T extends Record<string, unknown>>(
      table: string,
      filters?: SupabaseFilter,
      select?: string,
    ) {
      return request<T>(table, { method: "GET" }, filters, select);
    },
    async selectOne<T extends Record<string, unknown>>(
      table: string,
      filters?: SupabaseFilter,
      select?: string,
    ): Promise<T | null> {
      const rows = await request<T>(table, { method: "GET" }, filters, select);
      return rows[0] ?? null;
    },
  };
}
