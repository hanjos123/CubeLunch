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
import { IconButton, Checkbox, Button, Snackbar } from "react-native-paper";
import { database } from "../firebase";
import { onValue, ref, set } from "firebase/database";
import { COLOURS } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { formatNumber } from "../utils/helpers";
import moment from "moment/moment";

const dateTime = new Date().toLocaleString();
const BookFood = ({ route, navigation }) => {
  const { foodID } = route.params;
  const [food, setFood] = React.useState({
    price: 0,
  });
  const [optionFood, setOptionFood] = React.useState([]);
  const [amount, setAmount] = React.useState(0);
  const [checkedItems, setCheckedItems] = React.useState(
    new Array(optionFood.length).fill(false)
  );
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  React.useEffect(() => {
    const foodRef = ref(database, "Food/" + foodID);
    onValue(foodRef, (snapshot) => {
      const food = snapshot.val();
      setFood(food);
      setAmount(food.price);
    });
  }, []);

  React.useEffect(() => {
    const optionFoodRef = ref(database, "OptionFood");
    onValue(optionFoodRef, (snapshot) => {
      const optionFood = snapshot.val();
      setOptionFood(optionFood);
    });
  }, []);

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
    const userId = await getUserToken();

    let selectedOptions = [];
    selectedOptions.push({ nameFood: food.name, price: food.price });
    selectedOptions.push(
      ...optionFood
        .filter((option, index) => checkedItems[index])
        .map((option) => ({
          nameFood: option.nameOption,
          price: option.priceOption,
        }))
    );

    const historyRef = ref(
      database,
      "History/" + moment().format("YYYYMMDD") + "/" + userId
    );
    set(historyRef, {
      userId: userId,
      optionFood: selectedOptions,
      totalPrice: amount,
    });

    const historyUserRef = ref(
      database,
      "HistoryUser/" + userId + "/" + moment().format("YYYYMMDD")
    );
    set(historyUserRef, {
      optionFood: selectedOptions,
      totalPrice: amount,
      created_at: dateTime,
      status: 1,
      buyerId: 0,
    });
    setVisible(!visible);
  };
  const handleCheckbox = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    const newAmount =
      amount +
      (newCheckedItems[index]
        ? optionFood[index].priceOption
        : -optionFood[index].priceOption);
    setAmount(newAmount);
  };
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            navigation.navigate("Home");
          }}
        >
          <IconButton
            icon="arrow-left"
            color={COLOURS.darkBlue}
            containerColor={COLOURS.white}
            mode="contained"
          />
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
        <View style={styles.cardContainer}>
          <Text style={styles.foodTitle}>{food.name}</Text>
          <Text style={styles.foodTitle}>{formatNumber(food.price, ".")}</Text>
        </View>
        <View
          style={{
            height: 5,
            backgroundColor: COLOURS.neutral2,
          }}
        />
        <View>
          <Text
            style={{
              color: COLOURS.darkBlue,
              fontSize: 16,
              padding: 10,
              marginBottom: "1%",
              fontWeight: "bold",
            }}
          >
            Món thêm{" "}
            <Text
              style={{
                color: COLOURS.grey,
                fontSize: 12,
              }}
            >
              Không bắt buộc
            </Text>
          </Text>
        </View>
        <View>
          <View
            style={{
              padding: 10,
            }}
          >
            {optionFood &&
              optionFood.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleCheckbox(index)}
                >
                  <Checkbox
                    status={checkedItems[index] ? "checked" : "unchecked"}
                    onPress={() => handleCheckbox(index)}
                    color={COLOURS.primary}
                    style={styles.checkbox}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: COLOURS.darkBlue,
                      fontSize: 16,
                      paddingLeft: 8,
                      fontWeight: checkedItems[index] ? "bold" : "normal",
                    }}
                  >
                    {food.nameOption}
                  </Text>
                  <Text style={{ color: COLOURS.darkBlue }}>
                    +{formatNumber(food.priceOption, ".")}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 10 }}
        >
          <View
            style={{
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Button
                mode="contained"
                onPress={handleOrderPress}
                style={{
                  borderRadius: 5,
                  backgroundColor: COLOURS.primary,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Đặt món - {formatNumber(amount, ".")}
                </Text>
              </Button>
            </View>
            <Snackbar
              visible={visible}
              onDismiss={onDismissSnackBar}
              duration={1500}
              style={{
                backgroundColor: COLOURS.success,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Đặt món thành công
            </Snackbar>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  foodTitle: {
    height: 70,
    verticalAlign: "middle",
    color: COLOURS.darkBlue,
    fontSize: 22,
    paddingHorizontal: 10,
    paddingVertical: 13,
    lineHeight: 28,
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
    borderBottomColor: COLOURS.neutral3,
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
  },
});
export default BookFood;
