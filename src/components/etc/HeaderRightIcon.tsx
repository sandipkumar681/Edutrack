import {
  Alert,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LongPressedContext from "../../context/LongPressContext";
import { useContext } from "react";
import { MMKVLoader } from "react-native-mmkv-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../bottomStackPage/ExamStack";

const MMKV = new MMKVLoader().initialize();

const HeaderRightIcon = () => {
  const isDarkMode = useColorScheme() === "dark";
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { longPressed, selectedIndexes, setLongPressed, setSelectedIndexes } =
    useContext(LongPressedContext);
  // console.log(selectedIndexes);

  const handleEdit = () => {
    navigation.navigate("Edit Exam");
  };

  const handleDelete = () => {
    const examArray = MMKV.getMap("examArray");

    if (!examArray || !Array.isArray(examArray)) {
      Alert.alert("Error while deleting.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "Do you want to remove these entries? This can’t be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            const newExamArray = examArray.filter(
              (exam, index) => !selectedIndexes.includes(index)
            );
            // console.log(newExamArray);
            MMKV.setMap("examArray", newExamArray);
            setSelectedIndexes([]);
            setLongPressed(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {longPressed && (
        <Pressable style={[styles.iconPressable]} onPress={handleEdit}>
          <Icon
            name="pencil"
            size={25}
            color={isDarkMode ? "white" : "black"}
          />
        </Pressable>
      )}
      {longPressed && (
        <Pressable style={[styles.iconPressable]} onPress={handleDelete}>
          <Icon name="delete" size={25} color="#F44336" />
        </Pressable>
      )}
      <Pressable style={[styles.iconPressable]}>
        <Icon
          name="dots-vertical"
          size={25}
          color={isDarkMode ? "white" : "black"}
        />
      </Pressable>
    </View>
  );
};

export default HeaderRightIcon;

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 12 },
  iconPressable: { paddingHorizontal: 4 },
  cancelButton: { color: "red" },
});
