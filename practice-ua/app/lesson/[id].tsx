import { lessons } from "@/lib/lessons/lessons";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Lesson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{lesson.title}</Text>
    </View>
  );
}
