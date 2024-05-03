import React, { useState, useEffect, useSafeArea } from "react";
import {
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { toDate } from "date-fns";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "../assets/translations/localization";

import colors from "../constants/colors";
import { RowItem, RowSeparator } from "../components/RowItem";
import AddToDb from "../components/AddToDb";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  formContainer: {
    flex: 3,
  },
  titleContainer: {
    marginTop: screen.height * 0.02,
    color: colors.accent,
  },
  title: {
    color: colors.pink,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    marginTop: 15,
    marginRight: 5,
  },
});

export default ({ navigation, route = {} }) => {
  const params = route.params || {};
  const { titleParam } = params;
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{titleParam}</Text>
      </View>
      <View style={styles.formContainer}>
        <AddToDb />
      </View>
    </SafeAreaView>
  );
};
