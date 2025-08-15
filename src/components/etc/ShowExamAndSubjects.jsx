import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import LongPressedContext from "../../context/LongPressContext";

const ShowExamAndSubjects = ({ examArray, navigation }) => {
  const isDarkMode = useColorScheme() === "dark";

  const styles = getStyles(isDarkMode);

  const { longPressed, setLongPressed, selectedIndexes, setSelectedIndexes } =
    useContext(LongPressedContext);

  const isThisItemSelected = (index) => {
    return selectedIndexes.includes(index);
  };

  // useEffect(() => {
  //   console.log(selectedIndexes), [selectedIndexes];
  // });

  useEffect(() => {
    if (longPressed === false) {
      setSelectedIndexes([]);
    }
  }, [longPressed]);

  return (
    <ScrollView>
      {examArray.map((exam, examIndex) => (
        <Pressable
          key={examIndex}
          onPress={() => {
            if (longPressed) {
              if (isThisItemSelected(examIndex)) {
                if (selectedIndexes.length > 1) {
                  setSelectedIndexes((prev) =>
                    prev.filter((index) => index !== examIndex)
                  );
                } else {
                  setLongPressed(false);
                }
                return;
              } else {
                setSelectedIndexes((prev) => (prev = [...prev, examIndex]));
                return;
              }
            }
            navigation.navigate("Exam Details", {
              examName: exam.examName,
              exam,
            });
          }}
          onLongPress={() => {
            // console.log("long press");
            if (longPressed) {
              // setLongPressed((prev) => !prev);
              // setSelectedIndexes([]);
              setSelectedIndexes((prev) => (prev = [...prev, examIndex]));
            } else {
              setLongPressed((prev) => !prev);
              setSelectedIndexes((prev) => (prev = [...prev, examIndex]));
            }
          }}
          style={[
            styles.examCard,
            isThisItemSelected(examIndex) &&
              longPressed &&
              styles.longPressedCard,
          ]}
        >
          <Text style={styles.examTitle}>{exam.examName}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default ShowExamAndSubjects;

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    examCard: {
      backgroundColor: isDarkMode ? "#1c1c1e" : "#f9f9f9",
      marginHorizontal: 16,
      marginVertical: 10,
      padding: 16,
      borderRadius: 12,
      shadowColor: isDarkMode ? "white" : "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    examTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDarkMode ? "white" : "black",
      marginBottom: 8,
    },

    subjectList: {
      backgroundColor: isDarkMode ? "#2c2c2e" : "#e6f0f0",
      padding: 10,
      borderRadius: 8,
      marginTop: 6,
    },
    subjectText: {
      fontSize: 15,
      color: isDarkMode ? "#dcdcdc" : "#1e1e1e",
      paddingVertical: 2,
    },
    titleAndDetaiedIconContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    longPressedCard: {
      // borderWidth: 2,
      borderColor: "#4CAF50",
      backgroundColor: "#00a884",
    },
  });
