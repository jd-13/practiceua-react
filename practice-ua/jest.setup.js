import { NativeEventEmitter } from "react-native";

// Mock NativeEventEmitter to prevent "new NativeEventEmitter() requires a non-null argument" error
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  return {
    __esModule: true,
    default: class MockNativeEventEmitter {
      constructor() {
        this.listeners = {};
      }

      addListener() {
        return { remove: jest.fn() };
      }

      removeListener() {}

      removeAllListeners() {}

      emit() {}

      listenerCount() {
        return 0;
      }
    },
  };
});

// Mock RNFS to prevent "Cannot read properties of undefined" errors
jest.mock("react-native-fs", () => ({
  DocumentDirectoryPath: "/mock/documents",
  exists: jest.fn().mockResolvedValue(false),
  readFile: jest.fn().mockResolvedValue("{}"),
  writeFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({ mtime: Date.now() / 1000 }),
  RNFSFileTypeRegular: "regular",
}));

// Suppress console logs in tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
};

