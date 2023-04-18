import { TouchableOpacity, View, Text, Image } from "react-native";
import { COLOURS } from "../../constant";

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default FoodCard = ({ data, navigation }) => {
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
            width: 100,
            height: 190,
            resizeMode: "contain",
          }}
          source={{
            uri: data.image,
          }}
        />
      </View>
      <View>
        <Text>{data.name}</Text>
        <Text>{formatNumber(data.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};
