import * as React from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { COLOURS } from "../utils/constant";
import { Dimensions, Image, AlertIOS } from "react-native";
import { Icon } from "../assets";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState("dangthevinh12@gmail.com");
  const [password, setPassword] = React.useState("Thevinh2");
  const [errorMessage, setErrorMessage] = React.useState("");
  const handleLogin = async () => {
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem("userToken", data.user.uid);
      navigation.replace("Home");
    } catch (error) {
      console.error(error);
      setErrorMessage("Đăng nhập thất bại");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      showVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("../assets/Background.png")}
        style={{ height: Dimensions.get("window").height }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            padding: 10,
            marginHorizontal: 20,
            height: 500,
            gap: 16,
          }}
        >
          <View
            style={{
              position: "relative",
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 40,
              borderRadius: 10,
              gap: 16,
            }}
          >
            <Text
              style={{
                position: "absolute",
                top: "-20%",
                textAlign: "center",
                width: "100%",
                fontWeight: "bold",
                fontSize: 36,
              }}
            >
              CubeLunch
            </Text>
            <Text>{errorMessage}</Text>
            <TextInput
              value={email}
              mode="outlined"
              label="Username"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              value={password}
              mode="outlined"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 4,
                  width: "80%",
                  borderWidth: 1,
                  borderColor: COLOURS.darkBlue,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={handleLogin}
              >
                <Text
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: COLOURS.darkBlue,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={Icon.faceId} style={{ width: 40, height: 40 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    color: "white",
  },

  headerIcon: {
    color: "white",
    fill: "white",
  },
});
export default Login;
