import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Button,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import firebaseConfig, { db, app, storage } from "../config/firebaseConfig";
import { translations } from "../assets/translations/localization";

import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    borderColor: colors.secondary,
    borderWidth: 1,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  innerContainer: {
    flexDirection: "row",
  },
  containerLeft: {},
  containerRight: { marginLeft: 15 },
  itemHeading: {
    fontWeight: "bold",
    color: colors.secondary,
  },
  itemText: {
    fontWeight: "300",
    color: colors.secondary,
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    resizeMode: "contain",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    marginTop: 15,
  },
});

const Fetch = () => {
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  // fetch from db
  const [products, setProducts] = useState();

  useEffect(() => {
    const func = async () => {
      const q = collection(db, "products");
      onSnapshot(q, (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          // fetch data
          const { brandName, image, pao, productName } = doc.data();
          // timestamp to date
          const paoDate = pao.toDate().toLocaleDateString("pl");
          // push data
          products.push({
            id: doc.id,
            brandName,
            image,
            paoDate,
            productName,
          });
        });
        setProducts(products);
      });
    };

    if (products === undefined) {
      func();
    }
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <FlatList
        style={{ height: "100%" }}
        data={products}
        numColumns={1}
        renderItem={({ item }) => (
          <Pressable style={styles.container}>
            <View style={styles.innerContainer}>
              <View style={styles.containerLeft}>
                <Image style={styles.image} source={{ uri: item.image }} />
              </View>
              <View style={styles.containerRight}>
                <Text style={styles.itemHeading}>{i18n.t("brand")}</Text>
                <Text style={styles.itemText}>{item.brandName}</Text>
                <Text style={styles.itemHeading}>{i18n.t("product")}</Text>
                <Text style={styles.itemText}>{item.productName}</Text>
                <Text style={styles.itemHeading}>{i18n.t("expiration")}</Text>
                <Text style={styles.itemText}>{item.paoDate}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <View style={{ marginRight: 10 }}>
                <Button title="Placeholder 1" />
              </View>
              <View>
                <Button title="Placeholder 2" />
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Fetch;

/* <View style={styles.containerLeft}>
                <Image style={styles.image} source={{ uri: url }} />
              </View> */
