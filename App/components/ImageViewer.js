import { StyleSheet, Image, Dimensions } from "react-native";
import React from "react";

import colors from "../constants/colors";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    marginTop: 15,
    width: screen.width * 0.75,
    height: screen.height * 0.5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.pink,
  },
});

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource;

  return <Image source={imageSource} style={styles.image} />;
}
