import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, useColorScheme } from "react-native";
import ExamPage from "../examStack/ExamPage";
import CreateExam from "../examStack/CreateExam";
import HeaderRightIcon from "../etc/HeaderRightIcon";
import ExamDetails from "../examandsubjectpages/ExamDetails";
import EditExam from "../examStack/EditExam";

export type RootStackParamList = {
  "Exam Page": undefined;
  "Exam Details": { examName: string };
  "Edit Exam": undefined;
  "Create Exam": undefined;
};

const ExamStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const isDarkMode = useColorScheme() === "dark";

  return (
    <Stack.Navigator
      initialRouteName="Exam Page"
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 25,
          color: isDarkMode ? "white" : "black",
        },
        headerStyle: {
          backgroundColor: isDarkMode ? "black" : "white",
        },
        headerTintColor: isDarkMode ? "white" : "black",
        // headerTitleAlign: "center",
        headerRight: () => <HeaderRightIcon />,
      }}
    >
      <Stack.Screen
        name="Exam Page"
        component={ExamPage}
        options={{ title: "Edutrack" }}
      />
      <Stack.Screen name="Create Exam" component={CreateExam} />
      <Stack.Screen
        name="Exam Details"
        component={ExamDetails}
        options={({ route }) => ({
          title: route.params?.examName || "Exam Details",
        })}
      />
      <Stack.Screen name="Edit Exam" component={EditExam} />
    </Stack.Navigator>
  );
};

export default ExamStack;

const styles = StyleSheet.create({});
