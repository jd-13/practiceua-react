import { DatabaseProvider } from "@/lib/database/context";
import { LessonCategory } from "@/lib/lesson_core/definitions";
import { lessons } from "@/lib/lessons/lessons";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  View,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 4,
    textAlign: "center",
  },
  lessonItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  lessonCategory: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

function AllLessonsRoute() {
  const router = useRouter();

  // Group lessons by category
  const vocabularyLessons = lessons.filter(
    (lesson) => lesson.lessonCategory === LessonCategory.Vocabulary
  );
  const grammarLessons = lessons.filter(
    (lesson) => lesson.lessonCategory === LessonCategory.Grammar
  );

  const renderLessonList = (lessonList: typeof lessons) => (
    <>
      {lessonList.map((lesson, index) => (
        <TouchableOpacity key={index} style={styles.lessonItem} onPress={() => router.push(`/lesson/${lesson.id}`)}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      {grammarLessons.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Grammar</Text>
          {renderLessonList(grammarLessons)}
        </>
      )}

      {vocabularyLessons.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Vocabulary</Text>
          {renderLessonList(vocabularyLessons)}
        </>
      )}
    </ScrollView>
  );
}

function StarredLessonsRoute() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Starred Lessons</Text>
    </View>
  );
}

function RecentLessonsRoute() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Recent Lessons</Text>
    </View>
  );
}

function StaleLessonsRoute() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Stale Lessons</Text>
    </View>
  );
}

const renderScene = SceneMap({
  first: AllLessonsRoute,
  second: StarredLessonsRoute,
  third: RecentLessonsRoute,
  fourth: StaleLessonsRoute,
});

const routes = [
  { key: "first", title: "All" },
  { key: "second", title: "Starred" },
  { key: "third", title: "Recent" },
  { key: "fourth", title: "Stale" },
];

export default function Index() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <DatabaseProvider>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </DatabaseProvider>
  );
}
