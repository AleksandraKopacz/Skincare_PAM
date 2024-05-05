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
import { ScrollView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import * as uuid from "uuid";

// image picker
import * as ImagePicker from "expo-image-picker";

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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, app } from "../config/firebaseConfig";

// components
import { translations } from "../assets/translations/localization";
import colors from "../constants/colors";
import ImageViewer from "../components/ImageViewer";

const screen = Dimensions.get("window");

const PlaceholderImage = require("../assets/images/placeholder.jpg");

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

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

  // image picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const takeImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync();
    ImagePicker.getPendingResultAsync();

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };
  // image picker end

  // check for edit
  useEffect(() => {
    if (idParam !== undefined) {
      setDate(paoParam.toDate());
      setSelectedImage(imageParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // validation
  function checkInput() {
    let errors = {};
    if (!brandName) errors.brandName = i18n.t("fieldError");
    if (!productName) errors.productName = i18n.t("fieldError");
    if (!selectedImage) errors.selectedImage = i18n.t("fieldError");

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  // image upload to storage
  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    await getDownloadURL(fileRef).then((x) => {
      console.log(x);
      setUploadedImage(x);
    });

    // We're done with the blob, close and release it
    blob.close();
    return fileRef;
  }

  // add to database
  const addProduct = async () => {
    let imageRef = uploadImageAsync(selectedImage);
    console.log(uploadedImage);
    if (checkInput()) {
      if (idParam === undefined) {
        setUploadedImage(uploadImageAsync(selectedImage));
        console.log(uploadedImage);
        await addDoc(collection(db, "products"), {
          brandName,
          productName,
          image: uploadedImage,
          pao: date,
          addDate: serverTimestamp(),
        })
          .then(() => {
            console.log("success");
            ToastAndroid.show(i18n.t("AlertAddSuccess"), ToastAndroid.SHORT);
            navigation.pop();
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Something went wrong", error);
          });
      } else {
        if (imageParam === selectedImage) {
          setUploadedImage(imageParam);
        } else {
          uploadImageAsync(selectedImage);
        }
        await setDoc(doc(db, "products", idParam), {
          brandName,
          productName,
          image: uploadedImage,
          pao: date,
          addDate: addDateParam,
        })
          .then(() => {
            console.log("success");
            ToastAndroid.show(i18n.t("AlertEditSuccess"), ToastAndroid.SHORT);
            navigation.pop();
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Something went wrong", error);
          });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
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
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          <Button
            theme="primary"
            title="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button
            theme="primary"
            title="Take a photo"
            onPress={takeImageAsync}
          />
          {errors.selectedImage ? (
            <Text style={styles.itemError}>{errors.selectedImage}</Text>
          ) : null}
          <View style={{ marginTop: screen.height * 0.025 }}>
            <Button
              color={colors.pink}
              title={titleParam}
              onPress={() => addProduct()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
