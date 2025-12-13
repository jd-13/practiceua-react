import { Button, TextInput, View, StyleSheet, Text } from "react-native";
import {
  QuestionData,
  QuestionType,
  Response_FreeText_Data,
} from "./generator";
import { useState } from "react";

export function renderQuestion(
  data: QuestionData | null,
  onAnswered: (correct: boolean) => void
) {
  if (!data) {
    return <View></View>;
  }

  switch (data.type) {
    case QuestionType.Response_FreeText:
      return (
        <Response_FreeText_Component data={data} onAnswered={onAnswered} />
      );
  }

  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  feedbackHeading: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackLine1: {
    marginTop: 8,
    fontSize: 14,
  },
});

type Response_FreeText_Props = {
  data: Response_FreeText_Data;
  onAnswered: (correct: boolean) => void;
};

function Response_FreeText_Component({
  data,
  onAnswered,
}: Response_FreeText_Props) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean>(false);

  const submit = () => {
    if (submitted) return;

    const userAnswer = value.trim();
    setCorrect(userAnswer.toLowerCase() === data.correctAnswer.toLowerCase());

    setSubmitted(true);
    onAnswered(correct);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{data.questionText}</Text>

      <TextInput
        style={styles.input}
        value={value}
        editable={!submitted}
        onChangeText={setValue}
        placeholder="Type your answer…"
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      <Button
        title="Submit"
        onPress={submit}
        disabled={submitted || value.trim() === ""}
      />

      {submitted && (
          <Text style={styles.feedbackHeading}>
            {correct ? "Correct!" : `Oops!`}
          </Text>
        ) &&
        !correct && (
          <Text style={styles.feedbackLine1}>
            The correct answer is {data.correctAnswer}
          </Text>
        )}
    </View>
  );
}
