import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  COLOURS,
  PAYMENT_STATUS,
  PAYMENT_TEXT_STATUS,
} from "../../utils/constant";
import { formatNumber } from "../../utils/helpers";
import moment from "moment";

const HistoryCard = ({ data, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HistoryDetail", { historyID: data.id })
      }
      style={{
        width: "48%",
        width: "100%",
        height: 50,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: Dimensions.get("window").width,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: COLOURS.neutral2,
        }}
      >
        <View
          style={{
            justifyContent: "flex-start",
            marginLeft: 10,
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
            {data.optionFood[0].nameFood}
          </Text>
          <Text>
            {moment(data?.created_at, [
              "MM/DD/YYYY, h:mm:ss A",
              "MM/DD/YYYY, h:mm:ss",
              "MM/DD/YYYY, h:mm:ss a",
              "DD/MM/YYYY, h:mm:ss A",
              "DD/MM/YYYY, h:mm:ss",
              "DD/MM/YYYY, h:mm:ss a",
            ]).format("DD [thg] M YYYY HH:mm")}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <Text>{formatNumber(data.totalPrice)}</Text>
          <Text
            style={{
              color:
                data.status === PAYMENT_STATUS.UNPAID
                  ? COLOURS.primary
                  : COLOURS.success,
              textTransform: "uppercase",
              justifyContent: "flex-end",
            }}
          >
            {data.status === PAYMENT_STATUS.UNPAID
              ? PAYMENT_TEXT_STATUS.UNPAID
              : PAYMENT_TEXT_STATUS.PAID}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },

  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    backgroundColor: "transparent",
    color: "white",
  },

  headerIcon: {
    color: "white",
    fill: "white",
  },

  wFull: {
    width: 300,
  },

  // Food Component
  imageFood: {
    height: 200,
    width: "100%",
    resizeMode: "contain",
    borderRadius: 15,
  },

  nameFood: {
    fontSize: 14,
    color: "#424965",
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#424965",
  },
});

export default HistoryCard;
