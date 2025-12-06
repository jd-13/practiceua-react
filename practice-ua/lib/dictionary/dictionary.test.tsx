import RNFS from "react-native-fs";
import * as dictionary from "./dictionary";

jest.mock("react-native-fs", () => ({
  DocumentDirectoryPath: "/docs",
  exists: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
}));

// Mock NativeEventEmitter
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

const mockRNFS = RNFS as jest.Mocked<typeof RNFS>;

const mockStatResult = {
  mtime: Date.now(),
  size: 100,
  path: "",
  name: "test.json",
  mode: 33188,
  ctime: Date.now(),
  originalFilepath: "",
  isFile: () => true,
  isDirectory: () => false,
};

describe("dictionary.get()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return cached data when cache is valid", async () => {
    const target = "verbs";
    const version = "1.0";
    const cachedData = JSON.stringify({ word: "test" });

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValue(true);
    mockRNFS.stat.mockResolvedValue({
      ...mockStatResult,
      mtime: Date.now(),
    });
    mockRNFS.readFile.mockResolvedValue(cachedData);

    const result = await dictionary.get(target, version);

    expect(result).toBe(cachedData);
    expect(mockRNFS.readFile).toHaveBeenCalled();
  });

  it("should fetch from web and save to cache when cache is invalid", async () => {
    const target = "verbs";
    const version = "1.0";
    const newData = JSON.stringify({ word: "new" });

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValue(false);
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          verbs: "https://example.com/verbs",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => newData,
      } as Response);

    mockRNFS.mkdir.mockResolvedValue(undefined);
    mockRNFS.writeFile.mockResolvedValue(undefined);

    const result = await dictionary.get(target, version);

    expect(result).toBe(newData);
    expect(mockRNFS.mkdir).toHaveBeenCalled();
    expect(mockRNFS.writeFile).toHaveBeenCalled();
  });

  it("should fallback to cache when web fetch fails", async () => {
    const target = "verbs";
    const version = "1.0";
    const cachedData = JSON.stringify({ word: "cached" });

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValueOnce(false);
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    mockRNFS.readFile.mockResolvedValueOnce(cachedData);

    const result = await dictionary.get(target, version);

    expect(result).toBe(cachedData);
  });

  it("should throw when both web and cache fail", async () => {
    const target = "verbs";
    const version = "1.0";

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValueOnce(false);
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    mockRNFS.readFile.mockRejectedValueOnce(new Error("File not found"));

    await expect(dictionary.get(target, version)).rejects.toThrow(
      "Unable to download the lesson - please check your connectivity"
    );
  });

  it("should return false for cache validity when file does not exist", async () => {
    const target = "verbs";
    const version = "1.0";

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValue(false);

    // This is tested indirectly through get() when cache is invalid
    mockRNFS.readFile.mockRejectedValue(new Error("File not found"));
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    await expect(dictionary.get(target, version)).rejects.toThrow();
    expect(mockRNFS.exists).toHaveBeenCalled();
  });

  it("should treat expired cache as invalid and fetch from web", async () => {
    const target = "verbs";
    const version = "1.0";
    const newData = JSON.stringify({ word: "new" });
    const now = Date.now();

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValue(true);
    mockRNFS.stat.mockResolvedValue({
      ...mockStatResult,
      mtime: now - 61 * 60 * 1000, // 61 minutes ago (expired)
    });

    jest.setSystemTime(now);

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          verbs: "https://example.com/verbs",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => newData,
      } as Response);

    mockRNFS.mkdir.mockResolvedValue(undefined);
    mockRNFS.writeFile.mockResolvedValue(undefined);

    const result = await dictionary.get(target, version);

    expect(result).toBe(newData);
    expect(mockRNFS.writeFile).toHaveBeenCalled();
  });

  it("should handle fetch timeout gracefully", async () => {
    const target = "verbs";
    const version = "1.0";
    const cachedData = JSON.stringify({ word: "cached" });

    (mockRNFS.DocumentDirectoryPath as any) = "/docs";
    mockRNFS.exists.mockResolvedValueOnce(false);

    // Mock fetch to reject with timeout error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("AbortError"));

    mockRNFS.readFile.mockResolvedValueOnce(cachedData);

    const result = await dictionary.get(target, version);

    expect(result).toBe(cachedData);
  }, 10000);
});
