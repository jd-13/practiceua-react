import {
  getRandomCardinal,
  getRandomOrdinal,
  get_Response_FreeText_Question,
  buildGenerator,
} from "./numbers";

// Minimal mock dictionary
const mockDictionary = {
  cardinal: {
    "100": "сто",
    "1": ["один", "одна", "одне"],
    "2": ["два", "дві", "два"],
    "3": "три",
    "10": "десять",
    "20": "двадцять",
    "0": "нуль",
  },
  ordinal: {
    "1": ["перший", "перша", "перше", "перші"],
    "2": ["другий", "друга", "друге", "другі"],
    "3": ["третій", "третя", "третє", "треті"],
    "10": ["десятий", "десята", "десяте", "десяті"],
    "20": ["двадцятий", "двадцята", "двадцяте", "двадцяті"],
    "100": ["сотий", "сота", "соте", "соті"],
  },
};

describe("numbers.ts", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getRandomCardinal", () => {
    it("should generate 0 when random returns 0", () => {
      jest.spyOn(Math, "random").mockReturnValue(0);

      const [number, translation] = getRandomCardinal(mockDictionary, 10);

      expect(number).toBe("0");
      expect(translation).toBe("нуль");
    });

    it("should generate maxNumber when random returns nearly 1", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.99);

      const [number, translation] = getRandomCardinal(mockDictionary, 10);

      expect(parseInt(number)).toBe(10);
      expect(translation).toBe("десять");
    });

    it("should handle single digit 1 with gender notation", () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.5);
      jest.spyOn(Math, "random").mockReturnValueOnce(0.7);

      const [number, translation] = getRandomCardinal(mockDictionary, 2);

      expect(number).toBe("1 (neuter)");
      expect(translation).toBe("одне");
    });

    it("should handle single digit 2 with gender selection", () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.7);
      jest.spyOn(Math, "random").mockReturnValueOnce(0.4);

      const [number, translation] = getRandomCardinal(mockDictionary, 2);

      expect(number).toBe("2 (feminine)");
      expect(translation).toBe("дві");
    });
  });

  describe("getRandomOrdinal", () => {
    it("should return a tuple of [number, translation]", () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.2);
      jest.spyOn(Math, "random").mockReturnValueOnce(0.4);

      const [number, translation] = getRandomOrdinal(mockDictionary, 100);

      expect(number).toBe("20th (feminine)");
      expect(translation).toBe("двадцята");
    });

    it("should generate 1st with gender notation", () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.1);
      jest.spyOn(Math, "random").mockReturnValueOnce(0.8);

      const [number, translation] = getRandomOrdinal(mockDictionary, 10);

      expect(number).toBe("1st (plural)");
      expect(translation).toBe("перші");
    });
  });
});
