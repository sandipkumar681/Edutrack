import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  useColorScheme,
} from "react-native";
import { MMKVLoader } from "react-native-mmkv-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MMKV = new MMKVLoader().initialize();

const CreateExam = ({ navigation }) => {
  const isDarkMode = useColorScheme() === "dark";
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const styles = getStyles(isDarkMode);

  const handleAddSubject = () => {
    setSubjects([...subjects, {}]);
  };

  const handleChangeSubject = (text, index) => {
    const updated = [...subjects];
    updated[index] = text;
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

    let alreadyExistingArray = MMKV.getMap("examArray");

    const unqiueSubjectArray = new Set(
      subjects.filter((subject) => subject.trim().length !== 0)
    );

    const newExam = [
      {
        examName,
        subjects: new Array(...unqiueSubjectArray).map((subject) => ({
          subjectName: subject,
        })),
      },
    ];

    if (alreadyExistingArray && alreadyExistingArray?.length !== 0) {
      // console.log("If block executed");
      if (
        alreadyExistingArray.some(
          (alreadyExistingExam) =>
            alreadyExistingExam.examName === examName.trim()
        )
      ) {
        Alert.alert("Duplicate", "Exam already exists!");
        return;
      }
      // console.log("Yo");
      MMKV.setMap("examArray", [...alreadyExistingArray, ...newExam]);
      // console.log(MMKV.getMap("examArray"));
    } else {
      // console.log("else block executed");
      MMKV.setMap("examArray", newExam);
      // console.log(MMKV.getMap("examArray"));
    }
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
            value={subject}
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
        <Text style={styles.buttonText}>Create Exam</Text>
      </Pressable>
    </ScrollView>
  );
};

export default CreateExam;

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
