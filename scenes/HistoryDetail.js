import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { database } from "../firebase";
import { IconButton } from "react-native-paper";
import { onValue, ref, set } from "firebase/database";
import QRMomo from "./components/QRMomo";
import { PAYMENT_STATUS, PAYMENT_TEXT_STATUS } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { formatNumber } from "../utils/helpers";
import moment from "moment";
import { COLOURS } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";

const HistoryDetail = ({ route, navigation }) => {
  const { historyID } = route.params;
  const [historys, setHistorys] = React.useState({});
  const [buyerInfoList, setbuyerInfoList] = React.useState([]);
  const [firstOption, setFirstOption] = React.useState({});
  const [restOption, setRestOptions] = React.useState([]);
  const [userId, setUserToken] = React.useState(null);

  const getUserToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken !== null) {
        setUserToken(userToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getUserToken();
  }, []);

  React.useEffect(() => {
    const buyerInfoListRef = ref(database, "Buyer");
    onValue(buyerInfoListRef, (snapshot) => {
      const data = snapshot.val();
      const buyerInfoList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setbuyerInfoList(buyerInfoList);
    });
  }, []);
  const checkBuyer = () => {
    const matchingBuyers = [];
    const matchingCheck = buyerInfoList.filter((buyer) => {
      if (buyer.id === historys?.buyerId) {
        matchingBuyers.push(buyer.name);
      }
    });
    if (matchingBuyers.length > 0) {
      return matchingBuyers[0];
    } else {
      return "Không có ai mua cả";
    }
  };

  React.useEffect(() => {
    const historyRef = ref(database, "HistoryUser/" + userId + "/" + historyID);
    onValue(historyRef, (snapshot) => {
      const history = snapshot.val();
      const optionFood =
        history && history.optionFood ? history.optionFood : [];
      const [firstOptions] =
        optionFood.length > 9 ? optionFood.slice(0, 1) : null;
      const restOptions = optionFood.length > 1 ? optionFood.slice(1) : null;
      setFirstOption(firstOptions);
      setRestOptions(restOptions);
      setHistorys(history);
    });
  }, [userId]);

  console.log(historys);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "top",
          alignContent: "center",
          position: "relative",
          width: Dimensions.get("window").width,
          flex: 1,
        }}
      >
        <LinearGradient
          colors={["#FF7682", "#FF2900"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 35,
              left: 20,
              zIndex: 99,
            }}
            onPress={() => {
              navigation.navigate("HistoryList");
            }}
          >
            <IconButton icon="arrow-left" mode="contained" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        </LinearGradient>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              marginLeft: 10,
            }}
          >
            {
              <>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: 14,
                    marginLeft: 3,
                  }}
                >
                  {firstOption?.nameFood}
                </Text>
                <Text>
                  {moment(history?.created_at, [
                    "MM/DD/YYYY, h:mm:ss A",
                    "MM/DD/YYYY, h:mm:ss",
                    "MM/DD/YYYY, h:mm:ss a",
                  ]).format("DD [thg] M YYYY HH:mm")}
                </Text>
              </>
            }
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-end",
              marginRight: 10,
            }}
          >
            <Text>{historys?.totalPrice}</Text>
            <Text
              style={{
                color:
                  historys?.status === PAYMENT_STATUS.UNPAID
                    ? COLOURS.primary
                    : COLOURS.green,
                textTransform: "uppercase",
              }}
            >
              {historys?.status === PAYMENT_STATUS.UNPAID
                ? PAYMENT_TEXT_STATUS.UNPAID
                : PAYMENT_TEXT_STATUS.PAID}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              justifyContent: "flex-start",
              marginLeft: 10,
            }}
          >
            <Text style={styles.labelOptions}>Chi tiết đặt món</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "flex-start",
                marginLeft: 20,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                }}
              >
                - {firstOption?.nameFood}
              </Text>
              {restOption?.map((food, index) => (
                <Text
                  style={{
                    marginTop: 10,
                  }}
                  key={index}
                >
                  - {food.nameFood}
                </Text>
              ))}
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignContent: "flex-end",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                }}
              >
                {firstOption?.price} đ
              </Text>
              {restOption?.map((food, index) => (
                <Text
                  style={{
                    marginTop: 10,
                  }}
                  key={index}
                >
                  {formatNumber(food.price)} đ
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "flex-start",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <Text style={styles.labelOptions}>Người Mua:</Text>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: 14,
                  marginLeft: 3,
                }}
              >
                {checkBuyer()}
              </Text>
            </View>
          </View>
        </View>
        {/* <QRMomo /> */}
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  labelOptions: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    marginLeft: 3,
  },
});
export default HistoryDetail;
