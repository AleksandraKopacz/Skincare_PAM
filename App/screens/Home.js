import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Text,
  View,
  StyleSheet,
  Button,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { toDate } from "date-fns";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "../assets/translations/localization";

import colors from "../constants/colors";
import { RowItem, RowSeparator } from "../components/RowItem";
import Fetch from "../components/Fetch";
import AddToDb from "../components/AddToDb";

const styles = StyleSheet.create({
  container: {
    height: "92%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    marginTop: 15,
    marginRight: 5,
  },
});

export default () => {
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <AddToDb />
      </View>
      <View style={styles.buttonContainer}>
        <Button color="black" title={i18n.t("add")} />
      </View>
    </SafeAreaView>
  );
};
