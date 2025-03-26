import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";

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

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const func = async () => {
      await navigation.push("Brands");
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
