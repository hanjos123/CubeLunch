import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  Dimensions,
  Clipboard,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { database } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { onValue, ref, set } from "firebase/database";
import { Snackbar } from "react-native-paper";
import { COLOURS } from "../../utils/constant";
import moment from "moment/moment";

const QRMomo = ({ historyID }) => {
  const [historys, setHistorys] = React.useState({});
  const [buyers, setBuyers] = React.useState({});
  const [userId, setUserToken] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);
  const dateBuy = moment(historys.created_at, [
    "MM/DD/YYYY, h:mm:ss A",
    "MM/DD/YYYY, h:mm:ss",
    "MM/DD/YYYY, h:mm:ss a",
    "DD/MM/YYYY, h:mm:ss A",
    "DD/MM/YYYY, h:mm:ss",
    "DD/MM/YYYY, h:mm:ss a",
  ]);
  const phoneQR = buyers?.momo;
  const amountQR = historys?.totalPrice;
  const messageQR = "Thanh toán tiền cơm! " + dateBuy.format("DD/MM/YYYY");
  const momoTransferLink = `2|99|${phoneQR}|${buyers?.name}|${buyers?.mail}|0|0|${amountQR}|${messageQR}`;
  let logoFromFile = require("../../assets/icon/logo-momo.png");

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
    if (!userId) return;

    const historyRef = ref(database, "HistoryUser/" + userId + "/" + historyID);
    onValue(historyRef, (snapshot) => {
      const history = snapshot.val();
      setHistorys(history);
    });
  }, [userId, historyID]);
  React.useEffect(() => {
    if (historys.buyerId) {
      const buyerRef = ref(database, "Buyer/" + historys.buyerId);
      onValue(buyerRef, (snapshot) => {
        const buyer = snapshot.val();
        setBuyers(buyer);
      });
    }
  }, [historys.buyerId]);

  const handleCopy = () => {
    Clipboard.setString(buyers?.momo);
    setVisible(!visible);
  };

  return (
    <View>
      <View
        style={{
          width: 200,
          height: 250,
          marginTop: 20,
          marginLeft: "25%",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <QRCode
          value={momoTransferLink}
          size={200}
          color={COLOURS.darkBlue}
          logo={logoFromFile}
          backgroundColor={COLOURS.white}
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 10 }}>{buyers?.momo} </Text>
            <Text style={{ fontWeight: "bold" }}>{buyers?.name}</Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => handleCopy()}>
              <Image
                style={{
                  marginTop: 10,
                  width: 25,
                  height: 25,
                }}
                source={require("../../assets/icon/logo-clipboard.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={1000}
          style={{
            backgroundColor: `rgb(60, 179, 113)`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Copy thành công
        </Snackbar>
      </View>
    </View>
  );
};

export default QRMomo;
