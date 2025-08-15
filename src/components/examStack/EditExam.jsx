import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MMKVLoader } from "react-native-mmkv-storage";
import LongPressedContext from "../../context/LongPressContext";

const MMKV = new MMKVLoader().initialize();

const EditExam = () => {
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState([]);

  const { selectedIndexes, setLongPressed, setSelectedIndexes } =
    useContext(LongPressedContext);

  const selectedExamIndex = selectedIndexes[0];

  useEffect(() => {
    const examArray = MMKV.getMap("examArray");
    const selectedExam = examArray[selectedExamIndex];
    // console.log(selectedExam);
    setExamName(selectedExam.examName);
    setSubjects(selectedExam.subjects);
    setSelectedIndexes([]);
    setLongPressed(false);
  }, []);

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: "", selected: false }]);
  };

  const handleChangeSubject = (text, index) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], subjectName: text };
    setSubjects(updated);
  };

  const handleRemoveSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const handleSubmit = () => {
    if (!examName.trim()) {
      Alert.alert("Validation", "Exam name is required.");
      return;
    }

    // console.log(subjects);

    const filteredSubjectArray = subjects.filter(
      (subject) => subject.subjectName.trim().length !== 0
    );

    const seen = new Set();

    const unqiueSubjectArray = filteredSubjectArray.filter((subject) => {
      const name = subject.subjectName.trim().toLowerCase();

      if (seen.has(name)) return false;

      seen.add(name);
      return true;
    });

    // console.log(unqiueSubjectArray);
    const newExam = [
      {
        examName,
        subjects: unqiueSubjectArray,
      },
    ];
    // console.log(newExam);

    let examArray = MMKV.getMap("examArray");
    //   const newExamArray=examArray.map((subject)=>())
    examArray[selectedExamIndex] = { ...newExam[0] };
    // console.log(examArray);
    MMKV.setMap("examArray", examArray);

    setExamName("");
    setSubjects([]);
    navigation.popToTop();
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, styles.backgroundColorOfPage]}
    >
      <Text style={[styles.label, styles.textColorOfThisPage]}>
        Exam Name *
      </Text>
      <TextInput
        placeholder="Enter exam name"
        style={styles.input}
        value={examName}
        onChangeText={setExamName}
        placeholderTextColor={styles.textColorOfThisPage.color}
      />

      <View style={styles.subjectHeader}>
        <Text style={[styles.label, styles.textColorOfThisPage]}>
          Subjects (Optional)
        </Text>
        <Pressable onPress={handleAddSubject}>
          <Icon
            name="plus-circle"
            size={28}
            color={styles.textColorOfThisPage.color}
          />
        </Pressable>
      </View>

      {subjects.map((subject, index) => (
        <View key={index} style={styles.subjectFieldRow}>
          <TextInput
            placeholder={`Subject ${index + 1}`}
            style={[
              styles.input,
              {
                flex: 1,
                marginBottom: 0,
                color: isDarkMode ? "white" : "black",
              },
            ]}
            value={subject.subjectName}
            onChangeText={(text) => handleChangeSubject(text, index)}
            placeholderTextColor={styles.textColorOfThisPage.color}
          />
          <Pressable
            onPress={() => handleRemoveSubject(index)}
            style={styles.removeButton}
          >
            <Icon name="close-circle" size={28} color="crimson" />
          </Pressable>
        </View>
      ))}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditExam;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    backgroundColorOfPage: { backgroundColor: isDarkMode ? "black" : "white" },
    textColorOfThisPage: { color: isDarkMode ? "white" : "black" },
    container: {
      padding: 20,
      flexGrow: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 6,
    },
    input: {
      backgroundColor: isDarkMode ? "grey" : "#F5F5F5",
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 14,
      color: isDarkMode ? "white" : "black",
    },
    subjectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    subjectFieldRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      gap: 8,
    },
    removeButton: {
      padding: 4,
    },
    button: {
      backgroundColor: "#077a7d",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
