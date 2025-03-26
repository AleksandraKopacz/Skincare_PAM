import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

// firebase
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

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
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: screen.width * 0.05,
  },
  buttonContainerStar: {
    // marginRight: screen.width * 0.25,
  },
  buttonContainerHeart: {
    marginHorizontal: screen.width * 0.25,
  },
  buttonContainerFeather: {
    // marginLeft: screen.width * 0.25,
  },
});

export default ({ navigation, route = {} }) => {
  const params = route.params || {};
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // fetch from db
  const [brands, setBrands] = useState();

  useEffect(() => {
    const func = async () => {
      try {
        const q = query(collection(db, "brands"), orderBy("brandName"));
        onSnapshot(q, (querySnapshot) => {
          // eslint-disable-next-line no-shadow
          const brands = [];
          // eslint-disable-next-line no-shadow
          querySnapshot.forEach((doc) => {
            // fetch data
            const { brandName } = doc.data();
            // push data
            brands.push({
              id: doc.id,
              brandName,
            });
          });
          setBrands(brands);
          if (brands.length === 0) {
            setIsEmpty(true);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.log("An error happened: ", error);
      }
    };

    if (brands === undefined) {
      func();
    }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{i18n.t("brandList")}</Text>
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
            data={brands}
            numColumns={1}
            renderItem={({ item }) => (
              <>
                <Pressable style={styles.container}>
                  <View style={styles.innerContainer}>
                    <Text style={styles.itemText}>{item.brandName}</Text>
                  </View>
                </Pressable>
                <RowSeparator />
              </>
            )}
          />
        )}
      </View>
      <RowSeparator />
      <View style={styles.buttonContainer}>
        <Entypo
          color={colors.pink}
          size={20}
          name="star"
          onPress={() => navigation.push("Brands")}
          style={styles.buttonContainerStar}
        />
        <Entypo
          color={colors.pink}
          size={20}
          name="heart"
          onPress={() => navigation.push("Home")}
          style={styles.buttonContainerHeart}
        />
        <Entypo
          color={colors.pink}
          size={20}
          name="feather"
          onPress={() =>
            navigation.push("Add", {
              titleParam: i18n.t("newProduct"),
            })
          }
          style={styles.buttonContainerFeather}
        />
      </View>
    </SafeAreaView>
  );
};
