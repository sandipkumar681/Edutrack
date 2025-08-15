import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { MMKVLoader } from "react-native-mmkv-storage";
import React, { useEffect } from "react";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import appIcon from "../../images/appIcon.png";

type AuthScreenProps = NativeStackScreenProps<RootStackParamList, "AuthScreen">;

const MMKV = new MMKVLoader().initialize();

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "240861090718-0r1c8ikm49oo3di95rm9spdpb5t061ov.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      //   console.log(signInResult);
      if (signInResult?.type === "success") {
        const { givenName, photo } = signInResult.data.user;
        if (givenName) MMKV.setString("name", givenName);
        if (photo) MMKV.setString("avatar", photo);
        navigation.replace("Welcome");
      }
    } catch (error) {
      console.log("Signin Error", error);
    }
  };

  const handleContinueAsGuest = () => {
    MMKV.setString("name", "Guest");
    navigation.replace("Welcome");
  };

  return (
    <View style={[styles.container, styles.bgColor]}>
      <Image source={appIcon} style={[styles.image]} />
      <Text style={[styles.heading, styles.textColor]}>
        Welcome to Edutrack
      </Text>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={
          isDarkMode
            ? GoogleSigninButton.Color.Dark
            : GoogleSigninButton.Color.Light
        }
        onPress={handleGoogleSignIn}
      />
      <Pressable style={[styles.button]} onPress={handleContinueAsGuest}>
        <Text style={[styles.textColor]}>Continue as guest</Text>
      </Pressable>
    </View>
  );
};

export default AuthScreen;

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create<{
    container: ViewStyle;
    bgColor: ViewStyle;
    textColor: TextStyle;
    heading: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    image: ImageStyle;
    googleButton: ViewStyle;
  }>({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    bgColor: { backgroundColor: isDarkMode ? "black" : "white" },
    textColor: { color: isDarkMode ? "white" : "black" },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    button: {
      backgroundColor: isDarkMode ? "#1E88E5" : "#007BFF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginVertical: 10,
      width: "80%",
      alignItems: "center",
      elevation: 2,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    image: {
      height: 120,
      width: 120,
      resizeMode: "contain",
    },
    googleButton: {
      width: "80%",
      height: 48,
      marginVertical: 10,
    },
  });
