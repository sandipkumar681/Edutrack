import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const CheckInternetStatus = () => {
  const [connectionState, setConnectionState] = useState({});
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const checkNetInfo = async () => {
      NetInfo.fetch()
        .then((state) => {
          setConnectionState((prev) => (prev = { ...state }));
        })
        .catch((error) => console.log(error));
    };

    checkNetInfo();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectionState((prev) => (prev = { ...state }));
    });

    return () => unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={[styles.textColorOfThisPage]}>
        Connected to wifi or cellular :{" "}
        {connectionState.isConnected ? "Yes" : "No"}
      </Text>
      <Text style={[styles.textColorOfThisPage]}>
        Wifi : {connectionState.isWifiEnabled ? "enabled" : "Disabled"}
      </Text>
      <Text style={[styles.textColorOfThisPage]}>
        Type :{" "}
        {connectionState.type
          ? connectionState.type
          : "Please connect to Internet!"}
      </Text>
      <Text style={[styles.textColorOfThisPage]}>
        Internet :{" "}
        {connectionState.isInternetReachable ? "Reachable" : "Not reachable"}
      </Text>
    </View>
  );
};

export default CheckInternetStatus;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    textColorOfThisPage: { color: isDarkMode ? "white" : "black" },
    container: { justifyContent: "center", alignItems: "center", flex: 1 },
  });
