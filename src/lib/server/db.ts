import { getCloudflareDb } from "@/lib/server/cloudflare";

export function getDb() {
  return getCloudflareDb();
}

export async function queryFirst<T>(query: string, bindings: unknown[] = [], database = getDb()) {
  return database
    .prepare(query)
    .bind(...bindings)
    .first<T>();
}

export async function queryAll<T>(query: string, bindings: unknown[] = [], database = getDb()) {
  const result = await database
    .prepare(query)
    .bind(...bindings)
    .all<T>();
  return result.results ?? [];
}

export async function execute(query: string, bindings: unknown[] = [], database = getDb()) {
  return database
    .prepare(query)
    .bind(...bindings)
    .run();
}
