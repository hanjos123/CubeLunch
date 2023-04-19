import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRMomo = () => {
  const phone = "0787837485";
  const amount = "100000";
  const message = "Thank you!";
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
        <Text style={{ marginTop: 10 }}> Số điện thoại: {phone} </Text>
        <Text> Người nhận: Đặng Thế Vinh ---- SAI QR </Text>
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
