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
import { ref, get, onValue } from "firebase/database";
import { database } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

const HistoryList = ({ navigation }) => {
  const [historyUsers, setHistoryUsers] = React.useState([]);
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
    if (userId !== null) {
      const historyRef = ref(database, "HistoryUser/" + userId);
      onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        const history = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHistoryUsers(history);
      });
    }
  }, [userId]);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "top",
          alignContent: "center",
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
              navigation.navigate("Home");
            }}
          >
            <IconButton icon="arrow-left" mode="contained" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        </LinearGradient>
        <View style={styles.cardContainer}>
          <View>
            <Text style={{ marginLeft: 10, marginBottom: 10 }}>
              <Text>
                {moment(historyUsers[0]?.created_at, [
                  "MM/DD/YYYY, h:mm:ss A",
                  "MM/DD/YYYY, h:mm:ss",
                  "MM/DD/YYYY, h:mm:ss a",
                ]).format("[thg] M YYYY")}
              </Text>
            </Text>
          </View>
          {historyUsers?.map((setHistorys) => (
            <HistoryCard
              key={setHistorys.id}
              data={setHistorys}
              navigation={navigation}
            />
          ))}
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

export default HistoryList;
