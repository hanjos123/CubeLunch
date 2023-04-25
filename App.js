import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  HomeScreen,
  Login,
  BookFood,
  HistoryList,
  HistoryDetail,
} from "./scenes";
import { Image, View, Text } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { COLOURS } from "./utils/constant";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { PAYMENT_STATUS } from "./utils/constant";
import HeaderCompo from "./scenes/components/Header";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function TabNavigator() {
  const [badgeUser, setBadgeUser] = React.useState(0);
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
      const historyUserRef = ref(database, "HistoryUser/" + userId);
      onValue(historyUserRef, (snapshot) => {
        const historyUser = snapshot.val();
        let count = 0;
        const arrDate = Object.keys(historyUser);
        for (let i = 0; i < arrDate.length; i++) {
          if (historyUser[arrDate[i]].status === PAYMENT_STATUS.UNPAID) {
            count++;
          }
        }
        setBadgeUser(count);
      });
    }
  }, [userId]);

  return (
    <Tab.Navigator activeColor={COLOURS.primary}>
      <Tab.Screen
        name="MainStackNavigator"
        component={MainStackNavigator}
        options={{
          tabBarLabel: "Trang Chủ",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={
                focused
                  ? require("./assets/icon/home-active.png")
                  : require("./assets/icon/home.png")
              }
              style={{ width: 26, height: 26, tintColor: color }}
            />
          ),
          tabBarActiveBackgroundColor: "transparent",
          tabBarInactiveBackgroundColor: "white",
        }}
      />
      <Tab.Screen
        name="HistoryList"
        component={HistoryList}
        options={{
          tabBarLabel: "Lịch sử giao dịch",
          tabBarIcon: ({ color, focused }) => {
            return (
              <View style={{ position: "relative" }}>
                {!focused && badgeUser > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      width: 20,
                      height: 20,
                      top: -10,
                      right: -10,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: COLOURS.primary,
                      zIndex: 999,
                    }}
                  >
                    <Text
                      style={{
                        color: COLOURS.secondary,
                      }}
                    >
                      {badgeUser}
                    </Text>
                  </View>
                )}
                <Image
                  source={
                    focused
                      ? require("./assets/icon/history-active.png")
                      : require("./assets/icon/history.png")
                  }
                  style={{ width: 26, height: 26, tintColor: color }}
                />
              </View>
            );
          },
          tabBarActiveBackgroundColor: "transparent",
          tabBarInactiveBackgroundColor: "white",
        }}
      />
    </Tab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetail}
        options={{
          header: (props) => (
            <HeaderCompo title="Lịch sử giao dịch" {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="BookFood"
        component={BookFood}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
