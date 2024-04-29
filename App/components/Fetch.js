import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { firebase } from "../config/firebaseConfig";
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
    marginLeft: 'auto',
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
              <View style={styles.containerLeft}>
                <Image style={styles.image} source={{ uri: url }} />
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
              <View style={{marginRight: 10}}>
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
