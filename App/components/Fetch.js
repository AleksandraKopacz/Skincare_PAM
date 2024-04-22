import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config/firebaseConfig";


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
  const [users, setUsers] = useState([]);
  const todoRef = firebase.firestore().collection("brands").orderBy("brandName");

  useEffect(async () => {
    todoRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { brandName } = doc.data();
        users.push({
          id: doc.id,
          brandName,
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
              <Text style={styles.itemHeading}>{item.brandName}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Fetch;
