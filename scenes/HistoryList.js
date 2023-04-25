import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NavigationContainer,
  TouchableOpacity,
} from "react-native";
import HistoryCard from "./components/HistoryCard";
import { ref, get, onValue } from "firebase/database";
import { database } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { IconButton } from "react-native-paper";

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
  const sortedHistoryUsers = historyUsers?.sort((a, b) => {
    const aMonth = moment(a.created_at, [
      "MM/DD/YYYY, h:mm:ss A",
      "MM/DD/YYYY, h:mm:ss",
      "MM/DD/YYYY, h:mm:ss a",
      "DD/MM/YYYY, h:mm:ss A",
      "DD/MM/YYYY, h:mm:ss",
      "DD/MM/YYYY, h:mm:ss a",
    ]).month();
    const bMonth = moment(b.created_at, [
      "MM/DD/YYYY, h:mm:ss A",
      "MM/DD/YYYY, h:mm:ss",
      "MM/DD/YYYY, h:mm:ss a",
      "DD/MM/YYYY, h:mm:ss A",
      "DD/MM/YYYY, h:mm:ss",
      "DD/MM/YYYY, h:mm:ss a",
    ]).month();

    return bMonth - aMonth;
  });
  return (
    <View style={styles.container}>
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
            navigation.navigate("HomeScreen");
          }}
        >
          <IconButton icon="arrow-left" mode="contained" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "top",
            alignContent: "center",
          }}
        >
          <View style={styles.cardContainer}>
            {Object.entries(
              sortedHistoryUsers?.reduce((acc, history) => {
                const month = moment(history.created_at, [
                  "MM/DD/YYYY, h:mm:ss A",
                  "MM/DD/YYYY, h:mm:ss",
                  "MM/DD/YYYY, h:mm:ss a",
                  "DD/MM/YYYY, h:mm:ss A",
                  "DD/MM/YYYY, h:mm:ss",
                  "DD/MM/YYYY, h:mm:ss a",
                ]).format("[thg] M YYYY");
                if (!acc[month]) {
                  acc[month] = [];
                }
                acc[month].push(history);
                return acc;
              }, {})
            ).map(([month, histories]) => (
              <View key={month}>
                <View style={{ paddingBottom: 10 }}>
                  <Text>{month}</Text>
                </View>
                {histories
                  .sort((a, b) => {
                    const dateA = moment(a.created_at, [
                      "MM/DD/YYYY, h:mm:ss A",
                      "MM/DD/YYYY, h:mm:ss",
                      "MM/DD/YYYY, h:mm:ss a",
                      "DD/MM/YYYY, h:mm:ss A",
                      "DD/MM/YYYY, h:mm:ss",
                      "DD/MM/YYYY, h:mm:ss a",
                    ]);
                    const dateB = moment(b.created_at, [
                      "MM/DD/YYYY, h:mm:ss A",
                      "MM/DD/YYYY, h:mm:ss",
                      "MM/DD/YYYY, h:mm:ss a",
                      "DD/MM/YYYY, h:mm:ss A",
                      "DD/MM/YYYY, h:mm:ss",
                      "DD/MM/YYYY, h:mm:ss a",
                    ]);
                    return dateB.diff(dateA);
                  })
                  .map((history) => (
                    <HistoryCard
                      key={history.id}
                      data={history}
                      navigation={navigation}
                    />
                  ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  headerContainer: {
    backgroundColor: "#FF2900",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
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
});

export default HistoryList;
