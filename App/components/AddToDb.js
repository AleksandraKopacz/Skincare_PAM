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
import { RowSeparator } from "./RowItem";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screen.height * 0.1,
    color: colors.accent,
    marginHorizontal: screen.height * 0.025,
    marginBottom: screen.height * 0.10,
  },
  formContainer: {
    flex: 1,
    marginTop: screen.height * 0.02,
    color: colors.accent,
    marginHorizontal: screen.height * 0.02,
    marginBottom: screen.height * 0.02,
  },
  itemHeading: {
    fontWeight: "bold",
    color: colors.pink,
  },
  itemText: {
    color: colors.text,
  },
  inputText: {
    color: colors.text,
    marginVertical: 15,
    borderBottomWidth: 1,
    borderColor: colors.pink,
    padding: 15,
  },
  itemError: {
    color: colors.error,
    marginBottom: 15,
  },
  image: {
    flex: 1,
    width: screen.width * 0.25,
    height: screen.height * 0.1,
    resizeMode: "contain",
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 15,
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
  const [docId, setDocId] = useState("");

  // errors
  const [errors, setErrors] = useState({});

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

  // validation
  const checkInput = () => {
    let errors = {};
    if (!brandName) errors.brandName = i18n.t("fieldError");
    if (!productName) errors.productName = i18n.t("fieldError");

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // add to database
  const addProduct = async () => {
    if (checkInput()) {
      await addDoc(collection(db, "products", docId), {
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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.itemHeading}>{i18n.t("brand")}</Text>
          <TextInput
            style={styles.inputText}
            value={brandName}
            onChangeText={(brandName) => {
              setBrandName(brandName);
            }}
            placeholder={i18n.t("brand")}
          />
          {errors.brandName ? (
            <Text style={styles.itemError}>{errors.brandName}</Text>
          ) : null}
          <Text style={styles.itemHeading}>{i18n.t("product")}</Text>
          <TextInput
            style={styles.inputText}
            value={productName}
            onChangeText={(productName) => {
              setProductName(productName);
            }}
            placeholder={i18n.t("product")}
          />
          {errors.productName ? (
            <Text style={styles.itemError}>{errors.productName}</Text>
          ) : null}
          <Text style={styles.itemHeading}>{i18n.t("expiration")}</Text>
          <Text style={styles.itemText}>{i18n.t("infoTime")}</Text>
          <Text style={styles.itemHeading}>
            {i18n.t("selectedDate")}
            {date.toLocaleString()}
          </Text>
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1 }}>
              <Button
                color={colors.pink}
                onPress={showDatepicker}
                title={i18n.t("datePick")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                color={colors.pink}
                onPress={showTimepicker}
                title={i18n.t("timePick")}
              />
            </View>
          </View>
        </View>
        <View style={{ marginTop: screen.height * 0.025 }}>
          <Button
            color={colors.pink}
            title={i18n.t("add")}
            onPress={() => addProduct()}
          />
        </View>
      </View>
    </View>
  );
};

export default AddToDb;
