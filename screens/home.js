import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
  } from "react-native";
  import React, { Component } from "react";
  
  
  export default class Home extends Component {
    render() {
      const URL =
        "https://www.zapsports.com/ext/app_page_web/su-creation-compte.htm";
  
      return (
       
        <View style={{ backgroundColor: "white" }}>
          <View style={styles.creerCompte}>
            <TouchableOpacity
              style={styles.buttonCreer}
              onPress={() => this.props.navigation.navigate("COMPTE")}
            >
              <Text style={styles.compte}>Creer un compte</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("CHOIX ESCAPE RUN")}
            >
              <Image
                source={require("../assets/escape-run.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>ESCAPE RUN</Text>
          </View>
  
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("CHOIX COURSE CONNECTEE")
              }
            >
              <Image
                source={require("../assets/courses-virtuelles.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>COURSES CONNECTEES</Text>
          </View>
  
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("CHOISIR UN MODE")}
            >
              <Image
                source={require("../assets/entrainements.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>EXERCICES</Text>
          </View>
  
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("CHOIX COMPETITION")}
            >
              <Image
                source={require("../assets/competition.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>COMPETITIONS</Text>
          </View>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    textContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
  
    image: {
      height: 80,
      width: 300,
      marginTop: 20,
    },
  
    text: {
      fontWeight: "bold",
    },
  
    imageContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  
    compte: {
      fontWeight: "bold",
      borderWidth: 1,
      borderColor: "black",
      fontSize: 18,
      width: 300,
      textAlign: "center",
      marginTop: 5,
    },
  
    creerCompte: {
      justifyContent: "center",
      alignItems: "center",
    },
  });
  