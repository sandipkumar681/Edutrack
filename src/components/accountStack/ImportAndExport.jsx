import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import RNFS from "react-native-fs";
import { MMKVLoader } from "react-native-mmkv-storage";

const MMKV = new MMKVLoader().initialize();

const ImportAndExport = () => {
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);

  const exportArrayToTxt = async () => {
    Alert.alert(
      "Permission Required",
      "Before clicking OK, please go to:\n\nSettings > Apps > Special App Access > All Files Access > Edutrack\n\nand check if file access is granted to continue exporting.",
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
              const examArray = MMKV.getMap("examArray");
              if (!Array.isArray(examArray) || examArray.length === 0) {
                Alert.alert(
                  "No Exams",
                  "No exams found. Backup cannot be created."
                );
                // console.log("Exam array is empty in MMKV");
                return;
              }

              const folderpath = `${RNFS.DownloadDirectoryPath}/Edutrack`;
              const exists = await RNFS.exists(folderpath);
              if (!exists) {
                await RNFS.mkdir(folderpath);
              }

              const filePath = `${folderpath}/ExamList_Backup.txt`;
              const content = JSON.stringify(examArray);
              await RNFS.writeFile(filePath, content, "utf8");
              // console.log(`✅ File saved to: ${filePath}`);
              Alert.alert("Success", `Data exported as ${filePath}!`);
            } catch (error) {
              console.log("Export time error", error);
            }
          },
        },
      ]
    );
  };

  const importTxtToArray = async () => {
    Alert.alert(
      "Permission Required",
      "Before clicking OK, please go to:\n\nSettings > Apps > Special App Access > All Files Access > Edutrack\n\nand check if file access is granted to continue importing.",
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
              const folderpath = `${RNFS.DownloadDirectoryPath}/Edutrack`;
              await RNFS.exists(folderpath);
              const filePath = `${folderpath}/ExamList_Backup.txt`;

              const file = await RNFS.readFile(filePath);

              const examArray = JSON.parse(file);

              MMKV.setMap("examArray", examArray);
              Alert.alert("Success", `Exam List imported!`);
            } catch (error) {
              Alert.alert(
                "No File Found",
                "If file system permission is already granted, please check the following path:\n\n/storage/emulated/0/Download/Edutrack/ExamList_Backup.txt"
              );
              console.log("Import time error", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container]}>
      <Pressable style={[styles.textContainer]} onPress={exportArrayToTxt}>
        <Text style={[styles.textColorOfThisPage, styles.text]}>
          {" >  "} Export To Storage
        </Text>
      </Pressable>
      <Pressable style={[styles.textContainer]} onPress={importTxtToArray}>
        <Text style={[styles.textColorOfThisPage, styles.text]}>
          {" >  "} Import From Storage
        </Text>
      </Pressable>
    </View>
  );
};

export default ImportAndExport;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      marginTop: 30,
      gap: 18,
    },
    text: { fontSize: 17 },
    textContainer: {
      paddingVertical: 8,
      paddingHorizontal: 4,
      backgroundColor: isDarkMode ? "grey" : "#F5F5F5",
      borderRadius: 8,
    },
    textColorOfThisPage: { color: isDarkMode ? "white" : "black" },
  });
