import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import AccountPage from "../accountStack/AccountPage";
import HeaderRightIcon from "../etc/HeaderRightIcon";

const AccountStack = () => {
  const Stack = createNativeStackNavigator();

  const isDarkMode = useColorScheme() === "dark";

  return (
    <Stack.Navigator
      initialRouteName="Account Page"
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
        headerRight: HeaderRightIcon,
        // headerShown: false,
      }}
    >
      <Stack.Screen
        name="Account Page"
        component={AccountPage}
        options={{ title: "Account" }}
      />
      {/* <Stack.Screen name="Create Exam" component={CreateExam} />
      <Stack.Screen
        name="Exam Details"
        component={ExamDetails}
        options={({ route }) => ({
          title: route.params?.examName || "Exam Details",
        })}
      /> */}
    </Stack.Navigator>
  );
};

export default AccountStack;
