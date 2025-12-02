import { DatabaseProvider } from "@/lib/database/databaseContext";
import * as React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

function AllLessonsRoute() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>All Lessons</Text>
    </View>
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
