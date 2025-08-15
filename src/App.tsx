import Welcome from "./components/stackPages/Welcome";
import AuthScreen from "./components/stackPages/AuthScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { MMKVLoader } from "react-native-mmkv-storage";
import { StatusBar, useColorScheme } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ExamStack from "./components/bottomStackPage/ExamStack";
import LongPressedContextProvider from "./context/LongPressedContext";
import AccountStack from "./components/bottomStackPage/AccountStack";
import React from "react";
import LoadingScreen from "./components/etc/LoadingPage";

const MMKV = new MMKVLoader().initialize();

export type RootStackParamList = {
  Edutrack: undefined;
  AuthScreen: undefined;
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Tab.Navigator
      initialRouteName="Exam"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#077a7d",
        tabBarInactiveTintColor: "#a6a9a2",
        tabBarStyle: {
          height: 80,
          paddingHorizontal: 10,
          backgroundColor: isDarkMode ? "black" : "white",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          textAlign: "center",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Exam"
        component={ExamStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="book-open-page-variant" size={36} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account" size={36} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isUserDetailsAvalable, setIsUserDetailsAvalable] = useState<
    boolean | null
  >(null);

  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    const getNameAndAvatarUri = async () => {
      if (await MMKV.getStringAsync("name")) {
        setIsUserDetailsAvalable(true);
      } else {
        setIsUserDetailsAvalable(false);
      }
    };
    getNameAndAvatarUri();
  }, []);

  if (isUserDetailsAvalable === null) {
    return <LoadingScreen />;
  }

  return (
    <LongPressedContextProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={!isUserDetailsAvalable ? "AuthScreen" : "Edutrack"}
        >
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Edutrack"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LongPressedContextProvider>
  );
};

export default App;
