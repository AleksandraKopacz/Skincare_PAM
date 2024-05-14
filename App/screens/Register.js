/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validate from "react-native-email-validator";

// localization
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

// icons
import { Entypo } from "@expo/vector-icons";

// firebase
import {
  collection,
  onSnapshot,
  query,
  where,
  or,
  addDoc,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  showButton: {
    position: "absolute",
    alignSelf: "center",
    right: 0,
    marginTop: 35,
  },
});

// eslint-disable-next-line no-unused-vars
export default ({ navigation, route = {} }) => {
  // localization
  const localProperties = Localization.getLocales()[0];
  const i18n = new I18n(translations);
  i18n.locale = localProperties.languageCode;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  // user info
  const [email, setInputEmail] = useState();
  const [pass, setPass] = useState();
  const [username, setUsername] = useState();
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState();

  // errors
  const [errors, setErrors] = useState({});

  // show pass
  const [showPass, setShowPass] = useState(true);
  const [showIcon, setShowIcon] = useState("eye-with-line");

  // validation
  function checkInput() {
    let errors = {};
    if (!email) errors.email = i18n.t("fieldError");
    if (!pass) errors.pass = i18n.t("fieldError");
    if (!username) errors.username = i18n.t("fieldError");
    if (pass.indexOf(" ") >= 0) errors.pass = i18n.t("passError");
    if (username.indexOf(" ") >= 0) errors.username = i18n.t("usernameError");
    if (!validate(email)) errors.email = i18n.t("emailError");

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  const checkEmail = () => {
    let errors = {};
    const q = query(
      collection(db, "users"),
      or(
        where("emailLowercase", "==", email.toLowerCase()),
        where("usernameLowercase", "==", username.toLowerCase())
      )
    );
    // eslint-disable-next-line consistent-return
    onSnapshot(q, (querySnapshot) => {
      // eslint-disable-next-line no-shadow
      const users = [];
      // eslint-disable-next-line no-shadow
      querySnapshot.forEach((doc) => {
        // fetch data
        const { usernameLowercase, emailLowercase } = doc.data();
        // push data
        users.push({
          usernameLowercase,
          emailLowercase,
        });
      });
      setUsers(users);
      if (users.some((e) => e.emailLowercase === email.toLowerCase()))
        errors.email = i18n.t("emailError");
      if (users.some((e) => e.usernameLowercase === username.toLowerCase()))
        errors.username = i18n.t("usernameExists");
      setErrors(errors);
      if (Object.keys(errors).length > 0) {
        return false;
      }
    });
    return true;
  };

  const checkUser = async () => {
    if (checkInput() && checkEmail()) {
      await addDoc(collection(db, "users"), {
        username,
        usernameLowercase: username.toLowerCase(),
        email,
        emailLowercase: email.toLowerCase(),
        pass,
      })
        .then(() => {
          console.log("success");
          AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
          navigation.push("Home", {
            emailParam: email,
            usernameParam: username,
          });
          navigation.push("Home");
          return true;
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Something went wrong", error);
        });
    }
  };

  // show password
  const showPassFunc = () => {
    if (showPass) {
      setShowIcon("eye");
      setShowPass(false);
    } else {
      setShowIcon("eye-with-line");
      setShowPass(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{i18n.t("register")}</Text>
        </View>
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.itemHeading}>E-mail</Text>
            <TextInput
              style={styles.inputText}
              value={email}
              onChangeText={(email) => {
                setInputEmail(email);
              }}
              inputMode="email"
              keyboardType="email-address"
              placeholder="E-mail"
            />
            {errors.email ? (
              <Text style={styles.itemError}>{errors.email}</Text>
            ) : null}
            <Text style={styles.itemHeading}>{i18n.t("username")}</Text>
            <TextInput
              style={styles.inputText}
              value={username}
              onChangeText={(username) => {
                setUsername(username);
              }}
              placeholder={i18n.t("username")}
            />
            {errors.username ? (
              <Text style={styles.itemError}>{errors.username}</Text>
            ) : null}
            <Text style={styles.itemHeading}>{i18n.t("pass")}</Text>
            <View>
              <TextInput
                secureTextEntry={showPass}
                style={styles.inputText}
                value={pass}
                onChangeText={(pass) => {
                  setPass(pass);
                }}
                placeholder={i18n.t("pass")}
              />
              <Entypo
                name={showIcon}
                size={20}
                color={colors.pink}
                onPress={() => {
                  showPassFunc();
                }}
                style={styles.showButton}
              />
            </View>
            {errors.pass ? (
              <Text style={styles.itemError}>{errors.pass}</Text>
            ) : null}
            {errors.users ? (
              <Text style={styles.itemError}>{errors.users}</Text>
            ) : null}
            <Button
              color={colors.pink}
              title={i18n.t("register")}
              onPress={() => checkUser()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
