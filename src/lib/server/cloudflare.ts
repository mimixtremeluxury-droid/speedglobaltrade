type CloudflareRequestContext = {
  env: CloudflareEnv;
  cf?: unknown;
  ctx?: unknown;
};

function readCloudflareContext() {
  return (globalThis as Record<PropertyKey, unknown>)[Symbol.for("__cloudflare-context__")] as
    | CloudflareRequestContext
    | undefined;
}

export function getCloudflareContext() {
  const context = readCloudflareContext();
  if (!context?.env?.DB) {
    throw new Error("Cloudflare D1 binding is unavailable in this runtime context.");
  }
  return context;
}

export function getCloudflareDb() {
  return getCloudflareContext().env.DB;
}
