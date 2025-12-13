import {
  QuestionGenerator,
  QuestionType,
  Response_FreeText_Data,
  Config,
  Dictionary,
} from "@/lib/lesson_core/generator";
import { get } from "@/lib/dictionary/dictionary";

export async function getData(): Promise<Dictionary> {
  return JSON.parse(await get("numbers", "v1"));
}

class NumbersConfig {
  maxNumber: number = 1000;
  cardinal: boolean = true;
  ordinal: boolean = true;

  constructor(config: Partial<NumbersConfig>) {
    Object.assign(this, config);
  }
}

export function getRandomCardinal(
  dictionary: any,
  maxNumber: number
): [string, string] {
  let chosenNumber = Math.floor(Math.random() * (maxNumber + 1)).toString();
  let translatedString = "";

  const len = chosenNumber.length;

  const hundreds = len >= 3 ? chosenNumber[len - 3] : "";
  const tens = len >= 2 ? chosenNumber[len - 2] : "";
  const ones = chosenNumber[len - 1];

  let isDone = false;

  const cardinalNumbers = dictionary["cardinal"];

  // Hundreds
  if (hundreds !== "") {
    translatedString += cardinalNumbers[`${hundreds}00`] + " ";
  }

  // Tens
  if (tens !== "") {
    if (tens === "0") {
      // Do nothing
    } else if (tens === "1" && ones !== "0") {
      // Teens
      isDone = true;
      translatedString += cardinalNumbers[`${tens}${ones}`] + " ";
    } else {
      // Normal tens
      translatedString += cardinalNumbers[`${tens}0`] + " ";
    }
  }

  // Ones
  if (!isDone) {
    if (ones === "1" || ones === "2") {
      // One/two is a special case as it is gendered
      const genders = ["masculine", "feminine", "neuter"];
      const chosenGenderIndex = Math.floor(Math.random() * genders.length);

      translatedString += cardinalNumbers[ones][chosenGenderIndex];
      chosenNumber += ` (${genders[chosenGenderIndex]})`;
    } else {
      // Don't put a "нуль" on the end of a number like 20, 350, etc
      if (ones !== "0" || len === 1) {
        translatedString += cardinalNumbers[ones];
      }
    }
  }

  return [chosenNumber, translatedString.trim()];
}

export function getRandomOrdinal(
  dictionary: any,
  maxNumber: number
): [string, string] {
  let chosenNumber = Math.floor(Math.random() * (maxNumber + 1)).toString();
  let translatedString = "";

  const len = chosenNumber.length;

  const hundreds = len >= 3 ? chosenNumber[len - 3] : "";
  const tens = len >= 2 ? chosenNumber[len - 2] : "";
  const ones = chosenNumber[len - 1];

  let isDone = false;

  const genders = ["masculine", "feminine", "neuter", "plural"];
  const chosenGenderIndex = Math.floor(Math.random() * genders.length);

  // Hundreds
  if (hundreds !== "") {
    if (tens !== "0" || ones !== "0") {
      // Hundreds will be cardinal
      translatedString += dictionary["cardinal"][`${hundreds}00`] + " ";
    } else {
      // Hundreds will be ordinal
      translatedString =
        dictionary["oridinal"][`${hundreds}00`][chosenGenderIndex];
      chosenNumber += `th (${genders[chosenGenderIndex]})`;
      isDone = true;
    }
  }

  // Tens
  if (!isDone && tens !== "" && tens !== "0") {
    if (tens !== "1" && ones !== "0") {
      // Only the final digit is ordinal
      translatedString += dictionary["cardinal"][`${tens}0`] + "";
    } else if (tens !== "1" && ones === "0") {
      // The tens are ordinal
      translatedString += dictionary["ordinal"][`${tens}0`][chosenGenderIndex];
      const genderString = genders[chosenGenderIndex];
      chosenNumber += `th (${genderString})`;
      isDone = true;
    } else {
      // The teens are ordinal
      translatedString +=
        dictionary["ordinal"][`${tens}${ones}`][chosenGenderIndex];
      const genderString = genders[chosenGenderIndex];
      chosenNumber += `th (${genderString})`;
      isDone = true;
    }
  }

  // Ones
  if (!isDone) {
    // The final digit must be ordinal
    translatedString += dictionary["ordinal"][ones][chosenGenderIndex];

    if (ones == "1") {
      chosenNumber += "st";
    } else if (ones == "2") {
      chosenNumber += "nd";
    } else if (ones == "3") {
      chosenNumber += "rd";
    } else {
      chosenNumber += "th";
    }

    chosenNumber += ` (${genders[chosenGenderIndex]})`;
  }

  return [chosenNumber, translatedString.trim()];
}

export function get_Response_FreeText_Question(
  dictionary: any,
  config: Config
): Response_FreeText_Data {
  const numbersConfig = new NumbersConfig(config);

  const availableFunctions = [];

  if (numbersConfig.cardinal) {
    availableFunctions.push(getRandomCardinal);
  }
  if (numbersConfig.ordinal) {
    availableFunctions.push(getRandomOrdinal);
  }

  const chosenFunction =
    availableFunctions[Math.floor(Math.random() * availableFunctions.length)];

  const [chosenNumber, translatedString] = chosenFunction(
    dictionary,
    numbersConfig.maxNumber
  );

  return {
    questionText: `Translate: ${chosenNumber}`,
    correctAnswer: translatedString,
    feedbackComponent: undefined,
  };
}

export function buildGenerator(): QuestionGenerator {
  return new QuestionGenerator(
    get_Response_FreeText_Question,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );
}
