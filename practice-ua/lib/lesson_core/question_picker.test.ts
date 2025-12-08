import { pickQuestionType, getEvenWeights } from "./question_picker";
import { QuestionType } from "./definitions";

describe("pickQuestionType", () => {
  const supportedTypeWeights: Record<QuestionType, number> = {
    [QuestionType.Response_FreeText]: 0.2,
    [QuestionType.Response_MultipleChoice]: 0.3,
    [QuestionType.ResponseWithImage_FreeText]: 0.1,
    [QuestionType.ResponseWithImage_MultipleChoice]: 0.15,
    [QuestionType.FillIn_FreeText]: 0.15,
    [QuestionType.FillIn_MultipleChoice]: 0.05,
    [QuestionType.Pairs]: 0.05,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns first question type when rand < first weight", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // < 0.2 → first key
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.Response_FreeText);
  });

  test("returns second question type when rand falls in second weight range", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.25); // >0.2 && <0.5
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.Response_MultipleChoice);
  });

  test("returns third question type", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.55); // >0.5? No → <0.6
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.ResponseWithImage_FreeText);
  });

  test("returns fourth question type", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.65); // 0.6–0.75
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.ResponseWithImage_MultipleChoice);
  });

  test("returns fifth question type", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8); // 0.75–0.9
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.FillIn_FreeText);
  });

  test("returns sixth question type", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.92); // 0.9–0.95
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.FillIn_MultipleChoice);
  });

  test("returns seventh (last) question type when rand >= sum of all but last", () => {
    // Values above 0.95 should hit fallback or final range
    jest.spyOn(Math, "random").mockReturnValue(0.99);
    const result = pickQuestionType(supportedTypeWeights);
    expect(result).toBe(QuestionType.Pairs);
  });

  test("fallback returns last key if no weights match", () => {
    // This case happens if all weights are 0 except maybe last
    const zeroWeights: Record<QuestionType, number> = {
      [QuestionType.Response_FreeText]: 0,
      [QuestionType.Response_MultipleChoice]: 0,
      [QuestionType.ResponseWithImage_FreeText]: 0,
      [QuestionType.ResponseWithImage_MultipleChoice]: 0,
      [QuestionType.FillIn_FreeText]: 0,
      [QuestionType.FillIn_MultipleChoice]: 0,
      [QuestionType.Pairs]: 0,
    };

    jest.spyOn(Math, "random").mockReturnValue(0.7);

    const result = pickQuestionType(zeroWeights);
    expect(result).toBe(QuestionType.Pairs); // last enum entry
  });
});

describe("getEvenWeights", () => {
  test("assigns equal weights to all provided question types", () => {
    const supported = [
      QuestionType.Response_FreeText,
      QuestionType.Response_MultipleChoice,
      QuestionType.Pairs,
    ];

    const weights = getEvenWeights(supported);

    expect(weights[QuestionType.Response_FreeText]).toBeCloseTo(1 / 3);
    expect(weights[QuestionType.Response_MultipleChoice]).toBeCloseTo(1 / 3);
    expect(weights[QuestionType.Pairs]).toBeCloseTo(1 / 3);

    const sum = Object.values(weights).reduce((s, w) => s + w, 0);
    expect(sum).toBeCloseTo(1);
  });

  test("returns an empty object when given an empty array", () => {
    const weights = getEvenWeights([]);

    expect(Object.keys(weights)).toHaveLength(0);
  });

  test("works with a single supported type", () => {
    const supported = [QuestionType.Response_FreeText];
    const weights = getEvenWeights(supported);

    expect(weights[QuestionType.Response_FreeText]).toBe(1);

    // Should contain only 1 key
    const keys = Object.keys(weights).map((k) => Number(k));
    expect(keys).toEqual([QuestionType.Response_FreeText]);
  });
});
