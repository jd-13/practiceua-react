export enum QuestionType {
  Response_FreeText,
  Response_MultipleChoice,
  ResponseWithImage_FreeText,
  ResponseWithImage_MultipleChoice,
  FillIn_FreeText,
  FillIn_MultipleChoice,
  Pairs,
}

export class Response_FreeText_Data {
  questionText: string;
  correctAnswer: string;
  feedbackComponent: Function | undefined;

  constructor(
    questionText: string,
    correctAnswer: string,
    feedbackComponent: Function | undefined
  ) {
    this.questionText = questionText;
    this.correctAnswer = correctAnswer;
    this.feedbackComponent = feedbackComponent;
  }
}

export class Response_MultipleChoice_Data {
  questionText: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  feedbackComponent: Function | undefined;

  constructor(
    questionText: string,
    correctAnswer: string,
    incorrectAnswers: string[],
    feedbackComponent: Function | undefined
  ) {
    this.questionText = questionText;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
    this.feedbackComponent = feedbackComponent;
  }
}

export type QuestionData =
  | Response_FreeText_Data
  | Response_MultipleChoice_Data;
export type Dictionary = { [key: string]: any };
export type Config = { [key: string]: any };

type Response_FreeText_Func =
  | ((dictionary: Dictionary, config: Config) => Response_FreeText_Data)
  | undefined;
type Response_MultipleChoice_Func =
  | ((dictionary: Dictionary, config: Config) => Response_MultipleChoice_Data)
  | undefined;
type ResponseWithImage_FreeText_Func =
  | ((dictionary: Dictionary, config: Config) => any)
  | undefined;
type ResponseWithImage_MultipleChoice_Func =
  | ((dictionary: Dictionary, config: Config) => any)
  | undefined;
type FillIn_FreeText_Func =
  | ((dictionary: Dictionary, config: Config) => any)
  | undefined;
type FillIn_MultipleChoice_Func =
  | ((dictionary: Dictionary, config: Config) => any)
  | undefined;
type Pairs_Func = ((dictionary: Dictionary, config: Config) => any) | undefined;

export class QuestionGenerator {
  response_freeText: Response_FreeText_Func;
  response_multipleChoice: Response_MultipleChoice_Func;
  responseWithImage_freeText: ResponseWithImage_FreeText_Func;
  responseWithImage_multipleChoice: ResponseWithImage_MultipleChoice_Func;
  fillIn_freeText: FillIn_FreeText_Func;
  fillIn_multipleChoice: FillIn_MultipleChoice_Func;
  pairs: Pairs_Func;

  constructor(
    response_freeText: Response_FreeText_Func,
    response_multipleChoice: Response_MultipleChoice_Func,
    responseWithImage_freeText: ResponseWithImage_FreeText_Func,
    responseWithImage_multipleChoice: ResponseWithImage_MultipleChoice_Func,
    fillIn_freeText: FillIn_FreeText_Func,
    fillIn_multipleChoice: FillIn_MultipleChoice_Func,
    pairs: Pairs_Func
  ) {
    this.response_freeText = response_freeText;
    this.response_multipleChoice = response_multipleChoice;
    this.responseWithImage_freeText = responseWithImage_freeText;
    this.responseWithImage_multipleChoice = responseWithImage_multipleChoice;
    this.fillIn_freeText = fillIn_freeText;
    this.fillIn_multipleChoice = fillIn_multipleChoice;
    this.pairs = pairs;
  }
}
