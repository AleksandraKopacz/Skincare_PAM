/* eslint-disable no-unused-vars */
import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Entypo } from "@expo/vector-icons";

import Loading from "../screens/Loading";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Add from "../screens/Add";
import colors from "../constants/colors";

const MainStack = createStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="Loading"
      component={Loading}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

const ModalStack = createStackNavigator();
const ModalStackScreen = () => (
  <ModalStack.Navigator screenOptions={{ presentation: "modal" }}>
    <ModalStack.Screen
      name="Main"
      component={MainStackScreen}
      options={{ headerShown: false }}
    />
    <ModalStack.Screen
      name="Login"
      component={Login}
      options={({ navigation, route }) => ({
        headerShown: false,
      })}
    />
    <ModalStack.Screen
      name="Home"
      component={Home}
      options={({ navigation, route }) => ({
        headerShown: false,
      })}
    />
    <ModalStack.Screen
      name="Add"
      component={Add}
      options={({ navigation, route }) => ({
        title: "",
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={{ paddingHorizontal: 10 }}
          >
            <Entypo name="cross" size={30} color={colors.pink} />
          </TouchableOpacity>
        ),
      })}
    />
  </ModalStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <ModalStackScreen />
  </NavigationContainer>
);
