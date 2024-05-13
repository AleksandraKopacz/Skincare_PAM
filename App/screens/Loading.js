import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default ({ navigation, route = {} }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const func = async () => {
    const data = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(data);
    if (isLoggedIn === "true") {
      await navigation.push("Home");
    } else {
      await navigation.push("Login");
    }
  };
  
  useEffect(() => {
    func();
  });

  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color={colors.pink} />
    </View>
  );
};
