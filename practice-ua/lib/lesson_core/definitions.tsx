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
  supportedQuestionTypes: QuestionType[];
  lessonCategory: LessonCategory;
  dbName: string;

  constructor(
    title: string,
    supportedQuestionTypes: QuestionType[],
    lessonCategory: LessonCategory,
    dbName: string
  ) {
    this.title = title;
    this.supportedQuestionTypes = supportedQuestionTypes;
    this.lessonCategory = lessonCategory;
    this.dbName = dbName;
  }
}
