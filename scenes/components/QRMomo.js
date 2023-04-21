import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { database } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { onValue, ref, set } from "firebase/database";

const QRMomo = ({ navigation, route }) => {
  const { historyID } = route.params;
  const [historys, setHistorys] = React.useState({});
  const [buyers, setBuyers] = React.useState({});
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
    const historyRef = ref(database, "HistoryUser/" + userId + "/" + historyID);
    onValue(historyRef, (snapshot) => {
      const history = snapshot.val();
      setHistorys(history);
    });
  }, [userId]);

  React.useEffect(() => {
    if (history.buyerId) {
      const buyerRef = ref(database, "Buyer/" + history.buyerId);
      onValue(buyerRef, (snapshot) => {
        const buyer = snapshot.val();
        setBuyers(buyer);
      });
    }
  }, [history.buyerId]);

  const phone = buyers?.momo;
  const amount = historys.totalPrice;
  const message = "Thanh toán tiền cơm!";
  const data = `momoservice://momotransfer?phone=${phone}&amount=${amount}&message=${message}`;

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ justifyContent: "flex-start", marginLeft: 10 }}>
        <Text style={styles.labelOptions}>Momo</Text>
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <QRCode value={data} size={200} color="black" backgroundColor="white" />
        <Text style={{ marginTop: 10 }}> Số điện thoại: {buyers.momo} </Text>
        <Text> Người nhận: {buyers.name} ---- SAI QR </Text>
      </View>
    </View>
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

export default QRMomo;
