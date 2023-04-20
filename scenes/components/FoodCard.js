import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { COLOURS } from "../../utils/constant";
import { formatNumber } from "../../utils/helpers"

const FoodCard = ({ data, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("BookFood", { foodID: data.id })}
      style={{
        width: "48%",
        marginVertical: 14,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 200,
          borderRadius: 10,
          backgroundColor: COLOURS.backgroundLight,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: 200,
            resizeMode: "cover",
            borderRadius: 10,
          }}
          source={{
            uri: data.image,
          }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text>{data.name}</Text>
        <Text style={{ fontWeight: "700" }}>{formatNumber(data.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  textContainer: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "5%",
  },
});

export default FoodCard;
