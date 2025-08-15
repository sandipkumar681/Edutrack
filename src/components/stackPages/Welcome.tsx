import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import aiImage from "../../images/aiImage.png";
import { useEffect, useState } from "react";
import { MMKVLoader } from "react-native-mmkv-storage";
import { Exams } from "../../constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { ScrollView } from "react-native";

type WelcomeProps = NativeStackScreenProps<RootStackParamList, "Welcome">;

const MMKV = new MMKVLoader().initialize();

const WelcomePage = ({ navigation }: WelcomeProps) => {
  const [mockExamArray, setMockExamArray] = useState(Exams);

  const [doesAnyExamItemSelected, setDoesAnyExamItemSelected] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    const checkIfAnyExamItemSelected = () => {
      setDoesAnyExamItemSelected(
        mockExamArray.some((item) => item.selected === true)
      );
    };

    checkIfAnyExamItemSelected();
  }, [mockExamArray]);

  useEffect(() => {
    const getNameAndAvatarUri = async () => {
      const tempName = await MMKV.getStringAsync("name");
      if (tempName) setName(tempName);
      const tempAvatar = await MMKV.getStringAsync("avatar");
      if (tempAvatar) setAvatar(tempAvatar);
    };

    getNameAndAvatarUri();
  });

  const handleSkip = () => {
    navigation.replace("Edutrack");
  };

  const handleNext = () => {
    if (!doesAnyExamItemSelected) {
      Alert.alert("Incorrect Input", "No exam selected.");
      return;
    }

    const selectedExam = mockExamArray.filter((exam) => exam.selected);

    MMKV.setMap(
      "examArray",
      selectedExam.map((exam) => ({
        examName: exam.name,
        subjects: exam.subjects,
      }))
    );

    navigation.replace("Edutrack");
  };

  return (
    <ScrollView
      style={[
        styles.welcomePageContainer,
        isDarkMode ? styles.darkBg : styles.whiteBg,
      ]}
    >
      <View style={[styles.imageContainer]}>
        <Image
          style={styles.image}
          source={avatar ? { uri: avatar } : aiImage}
        />
      </View>
      <Text
        style={[
          styles.imageContainerText,
          isDarkMode ? styles.whiteText : styles.darkText,
        ]}
      >
        Hello, <Text style={styles.userNameText}>{name}</Text> 👋
      </Text>
      <Text
        style={[
          isDarkMode ? styles.whiteText : styles.darkText,
          styles.middleText,
        ]}
      >
        Choose Your Exam
      </Text>
      <View style={styles.examContainer}>
        {mockExamArray.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.examItemContainer,
              item.selected ? styles.examItemBackgroundColor : "",
            ]}
            onPress={() =>
              setMockExamArray((prev) =>
                prev.map((obj) =>
                  obj.id === item.id ? { ...obj, selected: !obj.selected } : obj
                )
              )
            }
          >
            <Text style={[styles.examItemText]}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.buttonWrapper]} onPress={handleSkip}>
          <Text
            style={[
              isDarkMode ? styles.whiteText : styles.darkText,
              styles.buttonWrapperText,
            ]}
          >
            Skip
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.buttonWrapper,
            doesAnyExamItemSelected ? styles.nextBg : styles.disabledNextBg,
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.whiteText, styles.buttonWrapperText]}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  welcomePageContainer: { padding: 6, flex: 1 },
  image: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 5,
  },
  whiteBg: { backgroundColor: "white" },
  darkBg: { backgroundColor: "black" },
  whiteText: { color: "white" },
  darkText: { color: "black" },
  imageContainerText: { fontSize: 20, textAlign: "center", marginTop: 5 },
  userNameText: { fontWeight: "bold" },
  middleText: {
    fontSize: 28,
    paddingHorizontal: 7,
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  examContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 25,
  },
  examItemBackgroundColor: { backgroundColor: "#f69b71" },
  examItemContainer: {
    width: "40%",
    height: 65,
    backgroundColor: "#eee",
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  examItemText: { fontWeight: "600", fontSize: 17 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  buttonWrapper: {
    width: "35%",
    borderRadius: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  // skipBg: { backgroundColor: "#051b26" },
  nextBg: { backgroundColor: "#7be2cf" },
  disabledNextBg: { backgroundColor: "#bff1e7" },
  buttonWrapperText: { fontSize: 15 },
});
