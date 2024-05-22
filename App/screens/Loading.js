import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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

// eslint-disable-next-line no-unused-vars
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
