import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Home, Login, BookFood, HistoryList, HistoryDetail } from "./scenes";
import { Provider as PaperProvider } from "react-native-paper";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HistoryList"
            component={HistoryList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HistoryDetail"
            component={HistoryDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BookFood"
            component={BookFood}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
