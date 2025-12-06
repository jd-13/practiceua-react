import {
  LessonDefinition,
  LessonCategory,
  QuestionType,
} from "../lesson_core/definitions";

export const lessons: LessonDefinition[] = [
  new LessonDefinition(
    "Numbers",
    [QuestionType.Response_FreeText],
    LessonCategory.Vocabulary,
    "numbers"
  ),
];
