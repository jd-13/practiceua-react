import RNFS from "react-native-fs";

const HTTP_TIMEOUT = 5000;
const CACHE_TTL = 60 * 60; // 1 hour in seconds

export async function get(target: string, version: string): Promise<string> {
  console.log(`getting ${target} ${version}`);

  const hasCache = await hasValidCache(target, version);

  if (hasCache) {
    console.log("cache hit", `get ${target}`);
    return getFromFile(target, version);
  } else {
    console.log("cache miss", `get ${target}`);
    try {
      const json = await getFromWeb(target, version);
      await saveToFile(target, version, json);

      console.log("downloaded - cache updated", `get ${target}`);
      return json;
    } catch (err) {
      console.log("connection failed", `get ${target}`, err);

      try {
        return await getFromFile(target, version);
      } catch {
        console.log("failed to fallback to cache", `get ${target}`);
        throw new Error(
          "Unable to download the lesson - please check your connectivity"
        );
      }
    }
  }
}

async function getFromWeb(target: string, version: string): Promise<string> {
  const urlsUrl =
    "https://raw.githubusercontent.com/jd-13/practiceua-data/main/urls.json";

  const urlsResp = await fetchWithTimeout(urlsUrl, HTTP_TIMEOUT);
  if (!urlsResp.ok) {
    throw new Error(`Failed to load urls (${urlsResp.status})`);
  }

  const urls = await urlsResp.json();
  if (!urls[target]) {
    throw new Error(`Could not find url for (${target})`);
  }

  const dataResp = await fetchWithTimeout(
    `${urls[target]}/${version}.json`,
    HTTP_TIMEOUT
  );

  if (!dataResp.ok) {
    throw new Error(`Failed to load data (${dataResp.status})`);
  }

  return dataResp.text();
}

async function getCacheFilePath(
  target: string,
  version: string
): Promise<string> {
  const base = RNFS.DocumentDirectoryPath;
  return `${base}/dictionary/${target}/${version}.json`;
}

async function hasValidCache(
  target: string,
  version: string
): Promise<boolean> {
  const filePath = await getCacheFilePath(target, version);

  const exists = await RNFS.exists(filePath);
  if (!exists) return false;

  const stat = await RNFS.stat(filePath);
  const modified = stat.mtime; // Seconds since epoch
  const isExpired = modified < Math.floor(Date.now() / 1000) - CACHE_TTL;

  return !isExpired;
}

async function saveToFile(
  target: string,
  version: string,
  content: string
): Promise<void> {
  const filePath = await getCacheFilePath(target, version);
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));

  await RNFS.mkdir(dir, {
    NSURLIsExcludedFromBackupKey: true, // avoid iCloud backup
  });

  await RNFS.writeFile(filePath, content, "utf8");
}

async function getFromFile(target: string, version: string): Promise<string> {
  const filePath = await getCacheFilePath(target, version);
  return RNFS.readFile(filePath, "utf8");
}

async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}
