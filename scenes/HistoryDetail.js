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
  const [histories, setHistories] = React.useState({});
  const [buyerInfoList, setbuyerInfoList] = React.useState([]);
  const [firstOption, setFirstOption] = React.useState({});
  const [restOption, setRestOptions] = React.useState([]);
  const [userId, setUserToken] = React.useState(null);

  React.useEffect(() => {
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

    getUserToken();
  }, []);

  React.useEffect(() => {
    if (userId !== null) {
      const historyRef = ref(
        database,
        "HistoryUser/" + userId + "/" + historyID
      );
      onValue(historyRef, (snapshot) => {
        const history = snapshot.val();
        const optionFood =
          history && history.optionFood ? history.optionFood : [];
        setFirstOption(optionFood[0]);
        setHistories(history);
      });
    }
  }, [userId]);

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

  const getNameBuyer = () => {
    const buyer = buyerInfoList.find(
      (buyer) => buyer?.id == histories?.buyerId
    );
    return buyer?.name ?? "-";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: COLOURS.darkBlue,
              fontSize: 14,
            }}
          >
            {firstOption?.nameFood}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLOURS.darkBlue,
            }}
          >
            {formatNumber(histories?.totalPrice)}
            <Text style={{ textDecorationLine: "underline" }}>đ</Text>
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: COLOURS.darkBlue,
            }}
          >
            {moment(histories?.created_at, [
              "MM/DD/YYYY, h:mm:ss A",
              "MM/DD/YYYY, h:mm:ss",
              "MM/DD/YYYY, h:mm:ss a",
              "DD/MM/YYYY, h:mm:ss A",
              "DD/MM/YYYY, h:mm:ss",
              "DD/MM/YYYY, h:mm:ss a",
            ]).format("DD [thg] M YYYY HH:mm")}
          </Text>
          <Text
            style={{
              color:
                histories?.status === PAYMENT_STATUS.UNPAID
                  ? COLOURS.primary
                  : COLOURS.success,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            {histories?.status === PAYMENT_STATUS.UNPAID
              ? PAYMENT_TEXT_STATUS.UNPAID
              : PAYMENT_TEXT_STATUS.PAID}
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.labelOptions}>Chi tiết đặt món</Text>
          {histories?.optionFood?.map((history, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                flexDirection: "row",
                paddingLeft: 15,
                justifyContent: "space-between",
                marginVertical: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.darkBlue,
                }}
              >
                - {history.nameFood}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.darkBlue,
                }}
              >
                {formatNumber(history.price)}
                <Text style={{ textDecorationLine: "underline" }}>đ</Text>
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={styles.labelOptions}>Người Mua:</Text>
          <Text
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              color: COLOURS.darkBlue,
            }}
          >
            {getNameBuyer()}
          </Text>
        </View>

        {getNameBuyer() !== "-" ? (
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Text style={styles.labelOptions}>Momo:</Text>
            <QRMomo historyID={historyID} userId={userId} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  labelOptions: {
    fontWeight: "bold",
    color: COLOURS.darkBlue,
    fontSize: 14,
  },
});
export default HistoryDetail;
