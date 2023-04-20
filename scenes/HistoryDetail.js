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
import { COLOURS } from "../constant";
import QRMomo from "./components/QRMomo";
import { PAYMENT_STATUS } from "../ultis/constant";
import moment from "moment";
import NavigatorBottom from "./components/Navigator";

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const HistoryDetail = ({ route, navigation }) => {
  const { historyID } = route.params;
  const [history, setHistorys] = React.useState({});
  const [firstOption, setfirstOption] = React.useState({});
  const [restOption, setRestOptions] = React.useState([]);
  React.useEffect(() => {
    const historyRef = ref(database, "History/" + historyID);
    onValue(historyRef, (snapshot) => {
      const history = snapshot.val();
      const optionFood = history.optionFood || []; // lấy mảng optionFood từ đối tượng history
      const [firstOptions] =
        optionFood.length > 0 ? optionFood.slice(0, 1) : null;
      const restOptions = optionFood.length > 1 ? optionFood.slice(1) : null;
      console.log(restOptions);
      setHistorys(history);
      setfirstOption(firstOptions);
      setRestOptions(restOptions);
    });
  }, []);
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
        <View style={styles.headerContainer}>
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
        </View>
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
            {firstOption && (
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
                  {firstOption.nameFood}
                </Text>
                <Text>
                  {moment(history.created_at, "DD/MM/YYYY, HH:mm:ss").format(
                    "DD [thg] M YYYY HH:mm"
                  )}
                </Text>
              </>
            )}
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-end",
              marginRight: 10,
            }}
          >
            <Text>{history.totalPrice}</Text>
            <Text
              style={{
                color: history.status === 1 ? "red" : "green",
                textTransform: "uppercase",
              }}
            >
              {history.status === 1
                ? PAYMENT_STATUS.UNPAID
                : PAYMENT_STATUS.PAID}
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
              {restOption &&
                restOption.map((food) => (
                  <Text
                    style={{
                      marginTop: 10,
                    }}
                  >
                    - {food.nameFood}
                  </Text>
                ))}
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                marginRight: 10,
              }}
            >
              {restOption &&
                restOption.map((food) => (
                  <Text
                    style={{
                      marginTop: 10,
                    }}
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
                Đặng Thế Vinh
              </Text>
            </View>
          </View>
        </View>
        {/*   <View style={{ marginTop: 20 }}>
         <View
            style={{
              justifyContent: "flex-start",
              marginLeft: 10,
            }}
          >
            <Text style={styles.labelOptions}>Momo</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "column",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Text style={{ margin: "auto" }}> QR </Text>
            <Text> Số điện thoại </Text>
            <Text> Đặng Thế Vinh </Text>
          </View>
        </View> */}
        <QRMomo />
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
