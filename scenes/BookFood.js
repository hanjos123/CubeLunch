import * as React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { IconButton, Checkbox, RadioButton, Button } from "react-native-paper";
import { database } from "../firebase";
import { onValue, ref, set } from "firebase/database";
import { COLOURS } from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const generateId = () => {
  const date = new Date();

  const year = date.getFullYear(); // Năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng (phải thêm 1 vì tháng trong JavaScript bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Ngày
  const hours = String(date.getHours()).padStart(2, "0"); // Giờ
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Phút
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Giây

  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return formattedDate;
};
const dateTime = new Date().toLocaleString();
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
  const [amount, setAmount] = React.useState(0);

  const handleCheckbox1Press = () => {
    setChecked1(!checked1);
    setAmount((preAmount) => {
      return checked1 ? preAmount - 5000 : preAmount + 5000;
    });
  };

  const handleCheckbox2Press = () => {
    setChecked2(!checked2);
    setAmount((preAmount) => {
      return checked2 ? preAmount - 5000 : preAmount + 5000;
    });
  };

  const getUserToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken !== null) {
        return userToken;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderPress = async () => {
    let selectedOptions = [];
    selectedOptions.push({ nameFood: food.name, price: food.price });
    if (checked1) {
      selectedOptions.push({ nameFood: "Trứng ốp la", price: 5000 });
    }
    if (checked2) {
      selectedOptions.push({ nameFood: "Chả trứng", price: 5000 });
    }

    const historyRef = ref(database, "History/" + generateId());
    set(historyRef, {
      userId: await getUserToken(),
      optionFood: selectedOptions,
      totalPrice: amount,
      created_at: dateTime,
      status: 1,
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
      setAmount(food.price);
    });
  }, []);
  return (
    <ScrollView>
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
              Đặt món - {formatNumber(amount)}
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
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
