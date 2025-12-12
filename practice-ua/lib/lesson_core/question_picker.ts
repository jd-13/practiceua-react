import { QuestionType } from "./generator";

export function pickQuestionType(
  supportedTypeWeights: Record<QuestionType, number>
): QuestionType {
  const entries = Object.keys(supportedTypeWeights)
    .map((k) => Number(k) as QuestionType)
    .map((questionType) => ({
      questionType,
      weight: supportedTypeWeights[questionType],
    }));

  // Get random number between 0 and 1
  const rand = Math.random();

  // Check where the random number falls within the ranges defined by the weights
  let cumulativeWeight = 0;
  for (const { questionType, weight } of entries) {
    if (rand < cumulativeWeight + weight) {
      return questionType;
    }
    cumulativeWeight += weight;
  }

  // Return the last key as a fallback
  return entries[entries.length - 1].questionType;
}

export function getEvenWeights(
  supportedTypes: QuestionType[]
): Record<QuestionType, number> {
  const weight = 1 / supportedTypes.length;

  return Object.fromEntries(
    supportedTypes.map((type) => [type, weight])
  ) as Record<QuestionType, number>;
}
