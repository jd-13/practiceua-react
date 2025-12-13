import { LessonDefinition, LessonCategory } from "../lesson_core/definitions";
import { buildGenerator, getData } from "./numbers/numbers";

export const lessons: LessonDefinition[] = [
  new LessonDefinition(
    "Numbers",
    LessonCategory.Vocabulary,
    "numbers",
    buildGenerator,
    getData
  ),
];
