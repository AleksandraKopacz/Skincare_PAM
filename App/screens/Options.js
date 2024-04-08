import React from "react";
import { SafeAreaView, ScrollView, Linking, Alert, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "../assets/translations/localization";

import colors from "../constants/colors";
import { RowItem, RowSeparator } from "../components/RowItem";

const openUrl = (url) => {
  return Linking.openURL(url).catch(() => {
    Alert.alert("Sorry, something went wrong.", "Please try again later.");
  });
};

export default () => {
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <RowItem
          title="Themes"
          onPress={() => alert("todo!")}
          rightIcon={
            <Entypo name="chevron-right" size={20} color={colors.blue} />
          }
        />

        <RowSeparator />

        <Text>{localProperties.languageCode}</Text>

        <Text>{i18n.t("greeting")}</Text>

        <RowSeparator />

        <RowItem
          title="React Native Basics"
          onPress={() => openUrl("https://www.youtube.com/")}
          rightIcon={<Entypo name="export" size={20} color={colors.blue} />}
        />

        <RowSeparator />

        <RowItem
          title="React Native by Example"
          onPress={() => alert("todo!")}
          rightIcon={<Entypo name="export" size={20} color={colors.blue} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
