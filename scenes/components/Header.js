import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { StyleSheet } from "react-native";
import { COLOURS, DAY_SHOW_FOOD } from "../../utils/constant";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({ navigation, route, options, back, title }) => {
  console.log(title);
  return (
    <LinearGradient
      colors={COLOURS.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.button}
    >
      <Appbar.Header style={styles.headerContainer}>
        {back ? <Appbar.BackAction color={COLOURS.white} onPress={navigation.goBack} /> : null}
        <Appbar.Content style={styles.headerTitle} color={COLOURS.white} title={title} />
      </Appbar.Header>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFF",
    top: "25%",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
