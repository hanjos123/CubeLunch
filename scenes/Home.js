import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FoodCard from "./components/FoodCard";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { database } from "../firebase";
import NavigatorBottom from "./components/Navigator";

const Home = ({ navigation }) => {
  const [foods, setFoods] = React.useState([]);

  React.useEffect(() => {
    const foodRef = ref(database, "Food");
    onValue(foodRef, (snapshot) => {
      console.log(snapshot);
      const data = snapshot.val();
      const food = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setFoods(food);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "top",
          alignContent: "center",
        }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Trưa nay ăn gì</Text>
        </View>
        <View style={styles.cardContainer}>
          {foods.map((food) => (
            <FoodCard data={food} navigation={navigation} />
          ))}
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <NavigatorBottom />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    padding: "1%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  naviContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});

export default Home;
