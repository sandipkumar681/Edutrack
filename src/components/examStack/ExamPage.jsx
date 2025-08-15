import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import blankArrayImage from "../../images/emptyArrayIcon.png";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MMKVLoader } from "react-native-mmkv-storage";
import ShowExamAndSubjects from "../etc/ShowExamAndSubjects";
import { useFocusEffect } from "@react-navigation/native";
import LongPressedContext from "../../context/LongPressContext";

const MMKV = new MMKVLoader().initialize();

const ExamPage = ({ navigation }) => {
  const isDarkMode = useColorScheme() === "dark";
  const [inputBoxValue, setInputBoxValue] = useState("");
  const [examArray, setExamArray] = useState([]);
  const [originalExamArray, setOriginalExamArray] = useState([]);

  const styles = getStyles(isDarkMode);
  const inputRef = useRef(null);

  const { selectedIndexes, setLongPressed } = useContext(LongPressedContext);

  const getExamList = () => {
    setExamArray(MMKV.getMap("examArray"));
    setOriginalExamArray(MMKV.getMap("examArray"));
  };

  const handleSearch = (e) => {
    setInputBoxValue(e);
    setExamArray(
      // console.log(
      originalExamArray.filter(
        (originalExam) =>
          // console.log(
          originalExam.examName.toLowerCase().includes(String(e).toLowerCase())
        // );
        // console.log(String(e).toLowerCase());
      )
    );
    // );
  };

  const removeFocus = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setInputBoxValue("");
    setExamArray(originalExamArray);
  };

  useFocusEffect(
    useCallback(() => {
      // console.log(
      //   "MMKV",
      //   typeof MMKV.getMap("examArray"),
      //   MMKV.getMap("examArray")
      // );

      getExamList();

      // console.log("Exam Page", typeof examArray, examArray);
      // console.log(!Array.isArray(examArray));
      // console.log(!examArray?.length === 0);
    }, [])
  );

  useEffect(() => {
    getExamList();
  }, [selectedIndexes]);

  return (
    <Pressable
      style={[styles.container]}
      onPress={() => {
        setLongPressed(false);
        removeFocus();
      }}
    >
      {examArray && (
        <View style={[styles.searchBoxAndIconContainer]}>
          <TextInput
            ref={inputRef}
            placeholder="🔍 Search"
            keyboardType="default"
            style={[
              styles.searchBox,
              !inputBoxValue.length > 0 ? styles.additionalInputBoxStyle : null,
            ]}
            value={inputBoxValue}
            onChangeText={(e) => {
              handleSearch(e);
            }}
            placeholderTextColor={isDarkMode ? "white" : "black"}
          />
          {inputBoxValue.length > 0 && (
            <Pressable style={[styles.cancelIcon]} onPress={removeFocus}>
              {/* <Icon name="close-circle-outline" size={28} color="blue" /> */}
              <Icon name="close" size={28} color="white" />
            </Pressable>
          )}
        </View>
      )}
      <View style={[styles.showExamNameContainer]}>
        {!Array.isArray(examArray) || examArray?.length === 0 ? (
          <View style={[styles.blankArrayImageContainer]}>
            <Image
              source={blankArrayImage}
              style={[styles.blankArrayImageStyle]}
            />
            <Text style={[styles.noExamText]}>No exams yet!</Text>
          </View>
        ) : (
          // <Text>else block</Text>
          <ShowExamAndSubjects examArray={examArray} navigation={navigation} />
        )}
      </View>
      <Pressable
        onPress={() => navigation.navigate("Create Exam")}
        style={[styles.plusIconContainer]}
      >
        <Icon name="plus" size={34} color="#f5eedd" />
      </Pressable>
    </Pressable>
  );
};

export default ExamPage;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "black" : "white",
    },
    lightBg: { backgroundColor: "white" },
    darkBg: { backgroundColor: "black" },
    lightText: { color: "white" },
    darkText: { color: "black" },
    imageContainerText: { fontSize: 20, textAlign: "center", marginTop: 5 },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginVertical: 15,
      marginHorizontal: 5,
    },
    iconPressable: { paddingHorizontal: 4 },
    blankArrayImageContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    blankArrayImageStyle: { width: 200, height: 200 },
    showExamNameContainer: { flex: 1 },
    plusIconContainer: {
      backgroundColor: "#077a7d",
      padding: 8,
      borderRadius: 50,
      position: "absolute",
      bottom: 18,
      right: 25,
    },
    searchBox: {
      paddingHorizontal: 18,
      backgroundColor: isDarkMode ? "#23282c" : "#f6f5f3",
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      color: isDarkMode ? "white" : "black",
      flex: 1,
    },
    noExamText: { color: isDarkMode ? "white" : "black", fontSize: 16 },
    searchBoxAndIconContainer: {
      marginVertical: 8,
      marginHorizontal: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cancelIcon: {
      backgroundColor: "red",
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    additionalInputBoxStyle: {
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    },
  });
