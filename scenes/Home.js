import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FoodCard from "./components/FoodCard";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { database } from "../firebase";
import { COLOURS, DAY_SHOW_FOOD } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";


const Home = ({ navigation }) => {
  const [foods, setFoods] = React.useState([]);

  React.useEffect(() => {
    const foodRef = ref(database, "Food");
    onValue(foodRef, (snapshot) => {
      const data = snapshot.val();
      const food = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setFoods(food);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={COLOURS.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Appbar.Header style={styles.headerContainer}>
          <Appbar.Content
            color={COLOURS.white}
            title="Trưa nay ăn gì"
          />
        </Appbar.Header>
      </LinearGradient>
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: "top",
            alignContent: "center",
          }}
        >
          <View style={styles.cardContainer}>
            {foods.map((food) =>
              food.dayShow == new Date().getDay() ||
              food.dayShow == DAY_SHOW_FOOD.ALL_DAY ? (
                <FoodCard data={food} navigation={navigation} key={food.id} />
              ) : null
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
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
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default Home;
