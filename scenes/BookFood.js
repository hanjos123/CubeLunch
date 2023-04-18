import * as React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { IconButton, Checkbox, RadioButton, Button } from "react-native-paper";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";
import { COLOURS } from "../constant";

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const CustomCheckbox = ({ label, checked, onPress }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={onPress}
        color="#FF2900"
        style={styles.checkbox}
      />
      <View>
        <Text style={styles.labelOptions}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
const BookFood = ({ route, navigation }) => {
  const { foodID } = route.params;
  const [food, setFood] = React.useState({});
  const [checked, setChecked] = React.useState(false);
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [foodTotal, setFoodTotal] = React.useState({ price: 30000 });

  const handleCheckbox1Press = () => {
    setChecked1(!checked1);
    setFoodTotal((prevFood) => {
      return {
        ...prevFood,
        price: checked1 ? prevFood.price - 5000 : prevFood.price + 5000,
      };
    });
  };

  const handleCheckbox2Press = () => {
    setChecked2(!checked2);
    setFoodTotal((prevFood) => {
      return {
        ...prevFood,
        price: checked2 ? prevFood.price - 5000 : prevFood.price + 5000,
      };
    });
  };

  const handleOrderPress = () => {
    let selectedOption = "";
    if (checked1 && !checked2) {
      selectedOption = "Trứng ốp la";
    } else if (!checked1 && checked2) {
      selectedOption = "Chả trứng";
    } else if (checked1 && checked2) {
      selectedOption = "Trứng ốp la && Chả trứng";
    }
    const historyRef = database.database().ref("History");
    historyRef
      .push({
        status: 1,
      })
      .then(() => {
        console.log("Đã lưu dữ liệu vào Firebase");
        console.log(
          "Đặt món id =",
          food.id,
          "; Tên món =",
          food.name,
          "; Option =",
          selectedOption,
          "; Tổng tiền =",
          foodTotal.price
        );
      })
      .catch((error) => {
        console.error("Lỗi khi lưu dữ liệu vào Firebase:", error);
      });
  };
  const handleMomoTransfer = () => {
    const momoTransferLink =
      "momo://pay?partner=merchant_123&amount=100000&description=Đơn hàng số 1234c";
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
        flex: 1,
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
          height: 375,
          resizeMode: "cover",
        }}
        source={{
          uri: food.image,
        }}
      />
      <Button icon="camera" mode="contained" onPress={handleMomoTransfer}>
        Press me
      </Button>
      <View style={styles.cardContainer}>
        <Text style={styles.foodTitle}>{food.name}</Text>
        <Text style={styles.foodTitle}>{food.price}</Text>
      </View>
      <View
        style={{
          height: "0.5%",
          backgroundColor: COLOURS.backgroundMedium,
        }}
      ></View>
      <View>
        <Text
          style={{
            color: COLOURS.darkBlue,
            fontSize: 16,
            marginLeft: "5%",
            marginTop: "3%",
            marginBottom: "1%",
            fontWeight: "400",
          }}
        >
          Món thêm{" "}
          <Text
            style={{
              color: COLOURS.darkBlue,
              fontSize: 12,
              fontWeight: "200",
            }}
          >
            Không bắt buộc
          </Text>
        </Text>
      </View>
      <View>
        <View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleCheckbox1Press}
          >
            <Checkbox
              status={checked1 ? "checked" : "unchecked"}
              onPress={handleCheckbox1Press}
              color="#FF2900"
              style={styles.checkbox}
            />
            <Text style={styles.labelOptions}>Trứng ốp la</Text>
            <Text style={{ paddingRight: "3%" }}>+5.000</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.checkboxContainer, styles.lastCheckboxContainer]}
            onPress={handleCheckbox2Press}
          >
            <Checkbox
              status={checked2 ? "checked" : "unchecked"}
              onPress={handleCheckbox2Press}
              color="#FF2900"
              style={styles.checkbox}
            />
            <Text style={styles.labelOptions}>Chả trứng</Text>
            <Text style={{ paddingRight: "3%" }}>+5.000</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: "3%",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            mode="contained"
            onPress={handleOrderPress}
            style={{
              borderRadius: 5,
              backgroundColor: "#FF2900",
            }}
          >
            Đặt món - {formatNumber(foodTotal.price)}
          </Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  foodTitle: {
    color: COLOURS.darkBlue,
    fontSize: 18,
    margin: "5%",
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
    marginBottom: 15,
  },
  lastCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,
    marginBottom: 0,
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 8,
    borderColor: COLOURS.darkBlue,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: "5%",
  },
  labelOptions: {
    flex: 1,
    color: COLOURS.darkBlue,
    fontSize: 16,
    paddingLeft: "3%",
    fontWeight: "300",
  },
});
export default BookFood;
