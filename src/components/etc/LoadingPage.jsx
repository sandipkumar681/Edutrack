import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Image,
} from "react-native";
import AppIcon from "../../images/appIcon.png";

const LoadingScreen = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff" },
      ]}
    >
      <Image source={AppIcon} style={styles.image} resizeMode="contain" />

      <ActivityIndicator size="large" color="#4CAF50" />

      {/* <Text
        style={[styles.loadingText, { color: isDarkMode ? "#fff" : "#000" }]}
      >
        Loading...
      </Text> */}
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "500",
  },
});
