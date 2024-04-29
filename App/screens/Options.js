import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { toDate } from "date-fns";

// firebase

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "../assets/translations/localization";

import colors from "../constants/colors";
import { RowItem, RowSeparator } from "../components/RowItem";
import Fetch from "../components/Fetch";

const styles = StyleSheet.create({
  container: {
    height: "70%",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.main }}>
      <View style={styles.container}>
        <Fetch />
      </View>
      <ScrollView>
        <RowSeparator />

        <Text>{localProperties.languageCode}</Text>

        <Text>{i18n.t("greeting")}</Text>

        <RowSeparator />
      </ScrollView>
    </SafeAreaView>
  );
};
