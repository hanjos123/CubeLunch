import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NavigationContainer,
  TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";
import HistoryCard from "./components/HistoryCard";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import NavigatorBottom from "./components/Navigator";
import moment from "moment";

const HistoryOrder = ({ navigation }) => {
  const [historys, setHistorys] = React.useState([]);

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

  React.useEffect(() => {
    const historyRef = ref(database, "History");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const history = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setHistorys(history);
    });
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: "top",
          alignContent: "center",
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
              navigation.navigate("Home");
            }}
          >
            <IconButton icon="arrow-left" mode="contained" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        </View>
        <View style={styles.cardContainer}>
          <View>
            <Text style={{ marginLeft: 10, marginBottom: 10 }}>
              <Text>
                {moment(historys[0]?.created_at, "DD/MM/YYYY, HH:mm:ss").format(
                  "[thg] M YYYY"
                )}
              </Text>
            </Text>
          </View>
          {historys.map((setHistorys) => (
            <HistoryCard data={setHistorys} navigation={navigation} />
          ))}
        </View>
        <NavigatorBottom />
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
    padding: "1%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  naviContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});

export default HistoryOrder;
