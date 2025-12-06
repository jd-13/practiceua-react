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

// Suppress console logs in tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
};

