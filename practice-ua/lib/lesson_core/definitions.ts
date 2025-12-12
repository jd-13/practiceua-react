import { Dictionary, QuestionGenerator } from "./generator";

export enum LessonCategory {
  Vocabulary,
  Grammar,
}

export class LessonDefinition {
  title: string;
  category: LessonCategory;
  id: string;
  getGenerator: () => QuestionGenerator;
  loadDictionary: () => Promise<Dictionary>;

  constructor(
    title: string,
    category: LessonCategory,
    id: string,
    getGenerator: () => QuestionGenerator,
    loadDictionary: () => Promise<Dictionary>
  ) {
    this.title = title;
    this.category = category;
    this.id = id;
    this.getGenerator = getGenerator;
    this.loadDictionary = loadDictionary;
  }
}
