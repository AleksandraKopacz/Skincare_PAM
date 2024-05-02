import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Button,
  Image,
  Dimensions,
  TextInput,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";

// date picker
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

// firebase
import {
  onSnapshot,
  collection,
  deleteDoc,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

//components
import { translations } from "../assets/translations/localization";
import colors from "../constants/colors";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  itemHeading: {
    fontWeight: "bold",
    color: colors.text,
  },
});

const AddToDb = () => {
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  // product variables
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");

  // date picker start
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  // date picker end

  const addProduct = async () => {
    await addDoc(collection(db, "products"), {
      brandName,
      productName,
      image:
        "https://firebasestorage.googleapis.com/v0/b/skincare-ee652.appspot.com/o/basiclab.jpg?alt=media&token=0cc29733-e925-41b9-817a-ef517be0dd87",
      pao: date,
      addDate: serverTimestamp(),
    })
      .then(() => {
        console.log("success");
        ToastAndroid.show(i18n.t("AlertAddSuccess"), ToastAndroid.SHORT);
        // return to products list
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Something went wrong", error);
      });
  };

  return (
    <View style={{ flex: 1, marginTop: screen.height * 0.1 }}>
      <Text style={styles.itemHeading}>{i18n.t("brand")}</Text>
      <TextInput
        value={brandName}
        onChangeText={(brandName) => {
          setBrandName(brandName);
        }}
        placeholder={i18n.t("brand")}
      />
      <Text style={styles.itemHeading}>{i18n.t("product")}</Text>
      <TextInput
        value={productName}
        onChangeText={(productName) => {
          setProductName(productName);
        }}
        placeholder={i18n.t("product")}
      />
      <Text style={styles.itemHeading}>{i18n.t("expiration")}</Text>
      <Text style={styles.itemHeading}>{i18n.t("infoTime")}</Text>
      <Button onPress={showDatepicker} title={i18n.t("datePick")} />
      <Button onPress={showTimepicker} title={i18n.t("timePick")} />
      <Text>
        {i18n.t("selectedDate")}
        {date.toLocaleString()}
      </Text>
      <Button title={i18n.t("add")} onPress={() => addProduct()} />
    </View>
  );
};

export default AddToDb;
