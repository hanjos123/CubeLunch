import React from "react";
import { View, StyleSheet, CommonActions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Home, HistoryList } from "./../index";

const Tab = createBottomTabNavigator();

export default function NavigatorBottom() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      onTabPress={({ route, preventDefault }) => {
        navigation.navigate(route.name); // chuyển đổi sang màn hình mới
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="HistoryLists"
        component={HistoryList}
        options={{
          tabBarLabel: "Lịch sử giao dịch",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
