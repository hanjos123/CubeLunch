import * as React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { IconButton, Checkbox, RadioButton, Button } from "react-native-paper";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";

export default BookFood = ({ route, navigation }) => {
  const { foodID } = route.params;
  const [food, setFood] = React.useState({});
  const [checked, setChecked] = React.useState(false);

  const handleMomoTransfer = () => {
    const momoTransferLink = "momo://pay?partner=merchant_123&amount=100000&description=Đơn hàng số 1234c";
    // const momoTransferLink = "momo://transaction";

    Linking.openURL(momoTransferLink);
    // Linking.canOpenURL(momoTransferLink).then((supported) => {
    //   console.log(supported);
    //   if (supported) {
    //     Linking.openUrl(momoTransferLink);
    //   }
    // });
  };

  React.useEffect(() => {
    const foodRef = ref(database, "Food/" + foodID);
    onValue(foodRef, (snapshot) => {
      console.log(snapshot);
      const food = snapshot.val();
      setFood(food);
    });
  }, []);
  return (
    <View
      style={{
        position: "relative",
        width: Dimensions.get("window").width,
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 99,
        }}
        onPress={() => {
          console.log(navigation);
          navigation.navigate("Home");
        }}
      >
        <IconButton icon="arrow-left" mode="contained" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          right: 20,
          zIndex: 99,
        }}
      >
        <IconButton icon="heart" mode="contained" />
      </TouchableOpacity>
      <Image
        style={{
          height: "66%",
          resizeMode: "cover",
        }}
        source={{
          uri: food.image,
        }}
      />
      <Button icon="camera" mode="contained" onPress={handleMomoTransfer}>
        Press me
      </Button>
      <Text>{food.name}</Text>
      <Text>{foodID}</Text>
      <Checkbox>
        <Checkbox.Item label="Item" status="checked" />
      </Checkbox>
    </View>
  );
};
