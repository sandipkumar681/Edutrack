import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { backendCaller } from "../../utils/backendCaller";
import { MMKVLoader } from "react-native-mmkv-storage";

const MMKV = new MMKVLoader().initialize();

const GoogleSignIn = () => {
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);

  const [googleUserInfo, setGoogleUserInfo] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type === "success") {
        setGoogleUserInfo(signInResult.data.user);
      }

      // const response = await fetch(
      //   "http://192.168.246.228:8087/api/v1/health"
      // );
      // const data = await response.json();
    } catch (error) {
      console.log("Signin Error", error);
    }
  };

  const exportArrayToServer = async () => {
    Alert.alert(
      "Notice",
      "Do you really want to backup your data in server ? It will take a few minutes to upload. \n\nPress OK to proceed.",
      [
        {
          text: "Cancel",
          style: "default",
          onPress: () => {
            return;
          },
        },
        {
          text: "Ok",
          style: "default",
          onPress: async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const tokens = await GoogleSignin.getTokens();
              // console.log(tokens);

              const examArray = !Array.isArray(MMKV.getMap("examArray"))
                ? []
                : MMKV.getMap("examArray");

              // console.log("examArray", examArray);
              const response = await backendCaller(
                "/user/create-user-or-update-exam",
                "POST",
                { "Content-Type": "application/json" },
                {
                  idToken: tokens.idToken,
                  examArray,
                }
              );

              if (response.success) {
                Alert.alert("Success", "Data uploaded to server.");
                return;
              }

              Alert.alert("Failed", "Can't upload data to server.");
              // console.log("auth response", response);
            } catch (error) {
              console.log("Export to server error", error);
            }
          },
        },
      ]
    );
  };

  const importArrayFromServer = async () => {
    Alert.alert(
      "Notice",
      "Do you really want to get your data from server? It will take a few minutes to download. \n\nPress OK to proceed.",
      [
        {
          text: "Cancel",
          style: "default",
          onPress: () => {
            return;
          },
        },
        {
          text: "Ok",
          style: "default",
          onPress: async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const tokens = await GoogleSignin.getTokens();
              // console.log(tokens);

              const response = await backendCaller(
                "/user/import-user-data",
                "POST",
                { "Content-Type": "application/json" },
                {
                  idToken: tokens.idToken,
                }
              );
              // console.log("import response", response);

              if (response?.success) {
                // console.log(response.data.examArray);
                MMKV.setString("name", response.data.fullName);
                MMKV.setMap("examArray", response.data.examArray);

                Alert.alert(
                  "Success",
                  "Data imported successfully from server."
                );
                return;
              }

              Alert.alert("Failed", "Can't import data from  server.");
              // console.log(response.message);
            } catch (error) {
              console.log("Export to server error", error);
            }
          },
        },
      ]
    );
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      setGoogleUserInfo(null);
    } catch (error) {
      console.log("Sign Out Error", error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "240861090718-0r1c8ikm49oo3di95rm9spdpb5t061ov.apps.googleusercontent.com",
      offlineAccess: false,
    });

    const checkIfUserSignedIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        // console.log(googleUserInfo);
        const isSignedIn = await GoogleSignin.getCurrentUser();
        // console.log("getCurrentUser", isSignedIn);

        if (!isSignedIn) {
          // console.log("User is not logged in yet!");
          return;
        }

        setGoogleUserInfo(isSignedIn);
        // const userInfo = await GoogleSignin.signInSilently();
        // console.log("User Info Silently", userInfo);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfUserSignedIn();
  }, [googleUserInfo]);

  return (
    <View style={[styles.container]}>
      {!googleUserInfo ? (
        <Pressable style={[styles.signInButton]} onPress={handleGoogleSignIn}>
          {/* <Text style={[styles.textColorOfThisPage]}>Login With Google</Text> */}
          <GoogleSigninButton />
        </Pressable>
      ) : (
        <>
          {/* <Text style={[styles.signedInStatusText]}>Google signed in</Text>*/}
          <View style={[styles.importExportContainer]}>
            <Pressable
              style={[styles.textContainer]}
              onPress={exportArrayToServer}
            >
              <Text style={[styles.textColorOfThisPage, styles.text]}>
                {" >  "} Export To Server
              </Text>
            </Pressable>
            <Pressable
              style={[styles.textContainer]}
              onPress={importArrayFromServer}
            >
              <Text style={[styles.textColorOfThisPage, styles.text]}>
                {" >  "} Import From Server
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.signOutContainer]}
            onPress={handleGoogleSignOut}
          >
            <Text style={[styles.signOutText]}>Signout from Google</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default GoogleSignIn;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      // justifyContent: "space-around"
    },
    textColorOfThisPage: { color: isDarkMode ? "white" : "black" },
    text: { fontSize: 17 },
    textContainer: {
      paddingVertical: 8,
      paddingHorizontal: 4,
      backgroundColor: isDarkMode ? "grey" : "#F5F5F5",
      borderRadius: 8,
    },
    importExportContainer: { marginTop: 20, gap: 18 },
    signedInStatusText: { fontSize: 20, color: "green", textAlign: "center" },
    signOutText: {
      color: "red",
      fontSize: 18,
      textAlign: "right",
      paddingRight: 20,
    },
    signOutContainer: { marginTop: 10 },
    signInButton: { alignItems: "center" },
  });
