import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "../assets/translations/localization";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  itemHeading: {
    fontWeight: "bold",
  },
  itemText: {
    fontWeight: "300",
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
  const [users, setUsers] = useState([]);
  const [url, setUrl] = useState();

  const todoRef = firebase.firestore().collection("products");

  useEffect(async () => {
    todoRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { brandName, image, pao, productName } = doc.data();
        const paoDate = pao.toDate().toLocaleDateString("pl");
        // fecth image
        const imageName = image.toString();
        const storage = getStorage();
        const reference = ref(storage, imageName);
        getDownloadURL(reference).then((x) => {
          setUrl(x);
        });
        users.push({
          id: doc.id,
          brandName,
          imageName,
          paoDate,
          productName,
          url,
        });
      });
      setUsers(users);
    });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <FlatList
        style={{ height: "100%" }}
        data={users}
        numColumns={1}
        renderItem={({ item }) => (
          <Pressable style={styles.container}>
            <View style={styles.innerContainer}>
              <Text style={styles.itemHeading}>
                {i18n.t("brand")} {item.brandName}
              </Text>
              <Text style={styles.itemHeading}>{item.productName}</Text>
              <Text style={styles.itemHeading}>{i18n.t("expiration")}</Text>
              <Text style={styles.itemHeading}>{item.paoDate}</Text>
              <Image
                style={{ width: "70%", height: "70%" }}
                source={{ uri: url }}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Fetch;
