/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Alert,
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  TextInput,
  ToastAndroid,
} from "react-native";

// date picker
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

// firebase
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// components
import { translations } from "../assets/translations/localization";
import colors from "../constants/colors";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    marginTop: screen.height * 0.1,
    color: colors.accent,
    marginHorizontal: screen.height * 0.025,
    marginBottom: screen.height * 0.1,
  },
  formContainer: {
    flex: 3,
    marginTop: screen.height * 0.1,
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
});

export default ({ navigation, route = {} }) => {
  const params = route.params || {};
  const {
    titleParam,
    brandNameParam,
    productNameParam,
    paoParam,
    imageParam,
    idParam,
    addDateParam,
    paoDateParam,
  } = params;
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  // product variables
  const [brandName, setBrandName] = useState(brandNameParam);
  const [productName, setProductName] = useState(productNameParam);

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

  useEffect(() => {
    if (paoParam !== undefined) {
      setDate(paoParam.toDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // validation
  function checkInput() {
    let errors = {};
    if (!brandName) errors.brandName = i18n.t("fieldError");
    if (!productName) errors.productName = i18n.t("fieldError");

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  // add to database
  const addProduct = async () => {
    if (checkInput()) {
      if (idParam === undefined) {
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
      } else {
        await setDoc(doc(db, "products", idParam), {
          brandName,
          productName,
          image:
            "https://firebasestorage.googleapis.com/v0/b/skincare-ee652.appspot.com/o/basiclab.jpg?alt=media&token=0cc29733-e925-41b9-817a-ef517be0dd87",
          pao: date,
          addDate: addDateParam,
        })
          .then(() => {
            console.log("success");
            ToastAndroid.show(i18n.t("AlertEditSuccess"), ToastAndroid.SHORT);
            // return to products list
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Something went wrong", error);
          });
      }
    }
    navigation.pop();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{titleParam}</Text>
      </View>
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
          {paoParam === undefined ? (
            <>
              <Text style={styles.itemHeading}>{i18n.t("selectedDate")}</Text>
              <Text style={styles.itemText}>{date.toLocaleString()}</Text>
            </>
          ) : (
            <>
              <Text style={styles.itemHeading}>{i18n.t("selectedDate")}</Text>
              <Text style={styles.itemText}>
                {paoParam.toDate().toLocaleString()}
              </Text>
              <Text style={styles.itemHeading}>{i18n.t("newDate")}</Text>
              <Text style={styles.itemText}>{date.toLocaleString()}</Text>
            </>
          )}
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
            title={titleParam}
            onPress={() => addProduct()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
