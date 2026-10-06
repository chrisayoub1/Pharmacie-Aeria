// Server-only helper: read/write JSON files in the private data repo
// (chrisayoub1/pharmacie-aeria-data) via the GitHub contents API.

const OWNER = "chrisayoub1";
const REPO = process.env.DATA_REPO || "pharmacie-aeria-data";
const TOKEN = process.env.GITHUB_ACCESS_TOKEN || "";

async function gh(path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "pharmacie-aeria",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  return res;
}

export async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await gh(path);
    if (!res.ok) return fallback;
    const { content } = await res.json();
    return JSON.parse(Buffer.from(content, "base64").toString("utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(path: string, data: unknown, message: string): Promise<void> {
  // Read current file to get its sha (needed to update)
  const res = await gh(path);
  let sha: string | undefined;
  if (res.ok) sha = (await res.json()).sha;

  const put = await gh(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) {
    throw new Error(`GitHub write failed ${put.status}`);
  }
}

// Retry with fresh sha on conflict (two concurrent writers)
export async function writeJsonSafe(path: string, update: (current: any) => any, message: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    const current = await readJson(path, null);
    const next = update(current);
    try {
      await writeJson(path, next, message);
      return;
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}
