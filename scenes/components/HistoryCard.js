import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { COLOURS, PAYMENT_STATUS } from "../../utils/constant";
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
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: COLOURS.backgroundMedium,
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
            {moment(data.created_at, "DD/MM/YYYY, HH:mm:ss").format(
              "DD [thg] M YYYY HH:mm"
            )}
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
              justifyContent: "flex-end",
              color: data.status === 1 ? "red" : "green",
              textTransform: "uppercase",
            }}
          >
            {data.status === 1 ? PAYMENT_STATUS.UNPAID : PAYMENT_STATUS.PAID}
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
