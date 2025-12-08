export enum QuestionType {
  Response_FreeText,
  Response_MultipleChoice,
  ResponseWithImage_FreeText,
  ResponseWithImage_MultipleChoice,
  FillIn_FreeText,
  FillIn_MultipleChoice,
  Pairs,
}

export enum LessonCategory {
  Vocabulary,
  Grammar,
}

export class LessonDefinition {
  title: string;
  lessonCategory: LessonCategory;
  id: string;

  constructor(title: string, lessonCategory: LessonCategory, id: string) {
    this.title = title;
    this.lessonCategory = lessonCategory;
    this.id = id;
  }
}
