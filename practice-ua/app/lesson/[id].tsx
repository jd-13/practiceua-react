import {
  Dictionary,
  getSupportedTypesFromGenerator,
  generateQuestionForType,
  QuestionData,
} from "@/lib/lesson_core/generator";
import {
  getEvenWeights,
  pickQuestionType,
} from "@/lib/lesson_core/question_picker";
import { lessons } from "@/lib/lessons/lessons";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Button } from "react-native";
import { renderQuestion } from "@/lib/lesson_core/question_components";
// import { useDatabase } from "@/lib/database/context";
import { useCallback, useEffect, useMemo, useState } from "react";

function renderSettings() {
  return <View></View>;
}

export default function Lesson() {
  // const db = useDatabase();
  const [answered, setAnswered] = useState<boolean>(false);

  const params = useLocalSearchParams() as Record<string, string>;
  const id = params.id;

  const lesson = lessons.find((l) => l.id === id);

  const generator = useMemo(() => {
    if (!lesson) return null;
    return lesson.getGenerator();
  }, [lesson]);

  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [weights, setWeights] = useState(() => {
    if (!generator) return null;
    const types = getSupportedTypesFromGenerator(generator);
    return getEvenWeights(types);
  });

  useEffect(() => {
    if (!lesson) return;

    console.log(`Loading dictionary for lesson ${lesson.id}`);
    let cancelled = false;

    const load = async () => {
      const dict = await lesson.loadDictionary();
      if (!cancelled) {
        setDictionary(dict);
        setLoading(false);
        console.log(`Dictionary loaded for lesson ${lesson.id}`);
      }
    };

    load();

    return () => {
      console.log(`Cancelled loading dictionary for lesson ${lesson.id}`);
      cancelled = true;
    };
  }, [lesson]);

  const loadNextQuestion = useCallback(() => {
    if (!dictionary || !generator || !weights) return;
    const selectedType = pickQuestionType(weights);
    console.log(`Selected question type: ${selectedType}`);

    setQuestionData(
      generateQuestionForType(selectedType, generator, dictionary, {})
    ); // TODO config

    setAnswered(false);
    setQuestionIndex((questionIndex) => questionIndex + 1);
  }, [dictionary, generator, weights]);

  useEffect(() => {
    if (!dictionary) return;

    console.log("Loading first question");
    loadNextQuestion();
  }, [dictionary, loadNextQuestion]);

  if (!lesson) {
    console.warn(`Lesson with id ${id} not found`);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  const onAnswered = (correct: boolean) => {
    setAnswered(true);
    // TODO update db
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading lesson</Text>
      </View>
    );
  }

  if (questionData === null) {
    return <View></View>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{lesson.title}</Text>
      <View key={questionIndex}>
        {renderQuestion(questionData, onAnswered)}
      </View>
      <Button title="Next" disabled={!answered} onPress={loadNextQuestion} />

      {renderSettings()}
    </View>
  );
}
