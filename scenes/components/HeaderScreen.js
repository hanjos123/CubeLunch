import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Screen = ({ children, titleHeader }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF7682", "#FF2900"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <Text style={styles.headerTitle}>{titleHeader}</Text>
      </LinearGradient>
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  headerContainer: {
    backgroundColor: "#FF2900",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    color: "#FFF",
    top: "25%",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
});
