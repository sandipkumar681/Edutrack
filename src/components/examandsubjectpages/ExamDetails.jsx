import {
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { MMKVLoader } from "react-native-mmkv-storage";
import * as Progress from "react-native-progress";

const MMKV = new MMKVLoader().initialize();

const ExamDetails = () => {
  const isDarkMode = useColorScheme() === "dark";
  const route = useRoute();
  const [exam, setExam] = useState(route.params?.exam);
  const { width } = useWindowDimensions();
  // console.log(Math.round(width));

  const styles = getStyles(isDarkMode);

  // console.log(typeof exam.subjects, exam);

  const progressBarValue = useMemo(() => {
    if (!exam?.subjects?.length) return;
    let numberOfSelectedSubjects = 0;
    exam.subjects.map((subject) =>
      subject.selected ? numberOfSelectedSubjects++ : null
    );
    return numberOfSelectedSubjects / exam.subjects.length;
  }, [exam]);

  const handleToggleSelect = (parameter) => {
    setExam((prev) => ({
      ...prev,
      subjects: prev.subjects.map((item) =>
        item.subjectName === parameter.subjectName
          ? { ...item, selected: item.selected ? !item.selected : true }
          : item
      ),
    }));
  };

  useEffect(() => {
    if (!exam) return;

    const examArray = MMKV.getMap("examArray");
    if (!examArray) return;

    const newExamArray = examArray.map((e) =>
      e.examName === exam.examName ? exam : e
    );

    MMKV.setMap("examArray", newExamArray);
  }, [exam]);

  return (
    <View style={[styles.backgroundColorOfPage, styles.container]}>
      <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={progressBarValue}
          borderRadius={10}
          width={width - 15}
          height={20}
        />
        <Text style={[styles.progressBarText, styles.textColorOfThisPage]}>
          {Math.round(progressBarValue * 100)} %
        </Text>
      </View>
      <View>
        {!exam.subjects.length ? (
          <Text style={[styles.textColorOfThisPage, styles.noSubjectsText]}>
            No Subjects
          </Text>
        ) : (
          exam.subjects.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.checkboxAndsubjectNameContainer]}
              onPress={() => {
                handleToggleSelect(item);
              }}
            >
              <View
                style={[styles.checkbox, item.selected && styles.checked]}
              />
              <Text style={[styles.textColorOfThisPage]}>
                {item.subjectName}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

export default ExamDetails;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 4,
      paddingHorizontal: 6,
      // justifyContent: "space-between",
    },
    progressBarText: { position: "absolute", fontWeight: "bold", fontSize: 16 },
    backgroundColorOfPage: { backgroundColor: isDarkMode ? "black" : "white" },
    textColorOfThisPage: { color: isDarkMode ? "white" : "black" },
    noSubjectsText: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 24,
    },
    checkboxAndsubjectNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: "#555",
      marginRight: 10,
      borderRadius: 4,
    },
    checked: {
      backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
    },
    progressBarContainer: { alignItems: "center", justifyContent: "center" },
  });
