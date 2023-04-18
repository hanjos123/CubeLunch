import React from "react";
import { View, Text } from "react-native";
import FoodCard from "./components/FoodCard";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { database } from "../firebase";

export default Home = ({ navigation }) => {
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text>Home</Text>
      {foods.map((food) => (
        <FoodCard data={food} navigation={navigation} />
      ))}
    </View>
  );
};
