import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Alert,
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

// notifications
import * as Notifications from "expo-notifications";

// firebase
import {
  onSnapshot,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../config/firebaseConfig";

// components
import { translations } from "../assets/translations/localization";
import colors from "../constants/colors";
import { RowSeparator } from "../components/RowItem";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: screen.height * 0.05,
    marginBottom: screen.height * -0.1,
    color: colors.accent,
    borderBottomColor: colors.pink,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: colors.pink,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 50,
  },
  container: {
    padding: screen.height * 0.025,
    marginHorizontal: screen.width * 0.025,
  },
  innerContainer: {
    flexDirection: "row",
    flex: 1,
  },
  containerLeft: {},
  containerRight: { marginLeft: screen.width * 0.05, flex: 1 },
  itemHeading: {
    fontWeight: "bold",
    color: colors.pink,
  },
  itemText: {
    color: colors.text,
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
    marginLeft: "auto",
    marginTop: 15,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ({ navigation, route = {} }) => {
  const params = route.params || {};
  const { emailParam, usernameParam } = params;
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // fetch from db
  const [products, setProducts] = useState();
  const [emailAsync, setEmailAsync] = useState(emailParam);
  const [usernameAsync, setUsernameAsync] = useState(usernameParam);

  useEffect(() => {
    const checkEmail = async () => {
      if (emailParam === undefined) {
        const dataEmail = await AsyncStorage.getItem("email");
        const dataUsername = await AsyncStorage.getItem("username");
        setEmailAsync(dataEmail);
        setUsernameAsync(dataUsername);
      } else {
        AsyncStorage.setItem("email", emailParam);
        AsyncStorage.setItem("username", usernameParam);
      }
    };

    const func = async () => {
      try {
        await checkEmail();
        const q = query(
          collection(db, "products"),
          where("email", "==", emailAsync),
          orderBy("addDate")
        );
        onSnapshot(q, (querySnapshot) => {
          // eslint-disable-next-line no-shadow
          const products = [];
          // eslint-disable-next-line no-shadow
          querySnapshot.forEach((doc) => {
            // fetch data
            const {
              brandName,
              image,
              pao,
              productName,
              addDate,
              email,
              idNotif,
            } = doc.data();
            // timestamp to date
            const paoDate = pao.toDate().toLocaleDateString();
            // push data
            products.push({
              id: doc.id,
              brandName,
              image,
              paoDate,
              productName,
              pao,
              addDate,
              email,
              idNotif,
            });
          });
          setProducts(products);
          if (products.length === 0) {
            setIsEmpty(true);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.log("An error happened: ", error);
      }
    };

    if (products === undefined) {
      func();
    }
  });

  const deleteProduct = async (id, image, idNotif) => {
    const imageRef = ref(storage, image);
    await Notifications.cancelScheduledNotificationAsync(idNotif);
    deleteObject(imageRef)
      .then(() => {
        console.log("deleted");
      })
      .catch((error) => {
        console.log(error);
      });
    await deleteDoc(doc(db, "products", id));
    ToastAndroid.show(i18n.t("AlertDeleteSuccess"), ToastAndroid.SHORT);
  };

  const logOut = async () => {
    AsyncStorage.setItem("isLoggedIn", "");
    AsyncStorage.setItem("email", "");
    AsyncStorage.setItem("username", "");
    navigation.push("Main");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.titleContainer}>
        <View style={styles.userContainer}>
          <Text style={{ color: colors.pink, fontSize: 20 }}>
            {i18n.t("greeting")}
            {usernameAsync}
          </Text>
          <View style={{ marginLeft: "auto" }}>
            <Entypo
              color={colors.pink}
              size={20}
              name="log-out"
              onPress={() => logOut()}
            />
          </View>
        </View>
        <Text style={styles.title}>{i18n.t("productList")}</Text>
      </View>
      <View style={{ flex: 3, marginTop: screen.height * 0.1 }}>
        {isEmpty ? (
          <Text
            style={{
              marginTop: 15,
              color: colors.pink,
              textAlign: "center",
              fontSize: 30,
            }}
          >
            {i18n.t("noProducts")}
          </Text>
        ) : null}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={colors.pink} />
          </View>
        ) : (
          <FlatList
            style={{ height: screen.height }}
            data={products}
            numColumns={1}
            renderItem={({ item }) => (
              <>
                <Pressable style={styles.container}>
                  <View style={styles.innerContainer}>
                    <View style={styles.containerLeft}>
                      <Image
                        style={styles.image}
                        source={{ uri: item.image }}
                      />
                    </View>
                    <View style={styles.containerRight}>
                      <Text style={styles.itemHeading}>{i18n.t("brand")}</Text>
                      <Text style={styles.itemText}>{item.brandName}</Text>
                      <Text style={styles.itemHeading}>
                        {i18n.t("product")}
                      </Text>
                      <Text style={styles.itemText}>{item.productName}</Text>
                      <Text style={styles.itemHeading}>
                        {i18n.t("expiration")}
                      </Text>
                      <Text style={styles.itemText}>{item.paoDate}</Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <View style={{ marginRight: screen.width * 0.05 }}>
                      <Button
                        color={colors.pink}
                        title={i18n.t("edit")}
                        onPress={() =>
                          navigation.push("Add", {
                            titleParam: i18n.t("editProduct"),
                            brandNameParam: item.brandName,
                            productNameParam: item.productName,
                            paoParam: item.pao,
                            imageParam: item.image,
                            idParam: item.id,
                            addDateParam: item.addDate,
                            paoDateParam: item.paoDate,
                            emailParam: item.email,
                            idNotifParam: item.idNotif,
                          })
                        }
                      />
                    </View>
                    <View>
                      <Button
                        color="red"
                        onPress={() =>
                          Alert.alert(
                            `${i18n.t("AlertDeleteTitle") + item.brandName} ${item.productName}?`,
                            i18n.t("AlertDeleteMsg"),
                            [
                              { text: i18n.t("no") },
                              {
                                text: i18n.t("yes"),
                                onPress: () =>
                                  deleteProduct(
                                    item.id,
                                    item.image,
                                    item.idNotif
                                  ),
                              },
                            ]
                          )
                        }
                        title={i18n.t("delete")}
                      />
                    </View>
                  </View>
                </Pressable>
                <RowSeparator />
              </>
            )}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={colors.pink}
          title={i18n.t("newProductAdd")}
          onPress={() =>
            navigation.push("Add", {
              titleParam: i18n.t("newProduct"),
              emailParam: emailAsync,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};
