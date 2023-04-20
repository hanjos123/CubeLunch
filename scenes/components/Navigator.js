import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Home, HistoryList } from "./../index";

//Screen names
const homeName = "Hôm nay ăn gì";
const detailsName = "Lịch sử giao dịch";

const Tab = createBottomTabNavigator();

function NavigatorBottom() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBarOptions={{
        activeTintColor: "red",
      }}
    >
      <Tab.Screen
        name="Trưa nay ăn gì"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Lịch sử giao dịch"
        component={HistoryScreen}
        options={{
          tabBarLabel: "Lịch sử giao dịch",
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon
                name="badge-account-horizontal-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  const goToHistoryList = () => {
    navigation.navigate("HistoryList");
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Go to History List" onPress={goToHistoryList} />
    </View>
  );
}

function HistoryScreen() {
  const navigation = useNavigation();

  const goToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text>History List Screen</Text>
      <Button title="Go to Home" onPress={goToHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default NavigatorBottom;
