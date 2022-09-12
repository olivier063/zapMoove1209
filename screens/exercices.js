import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    RefreshControl,
    FlatList,
    ActivityIndicator,
  } from "react-native";
  import React, { Component, useRef, useEffect } from "react";
  
  export class Exercices extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
      };
    }
  
    async getExercices() {
      try {
        const response = await fetch(
          "https://www.zapmoove.fr/ext/zapmoove/listeTraining.php"
        );
        const json = await response.json();
        this.setState({ data: json });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  
    componentDidMount() {
      this.getExercices();
    }
  
    componentDidUpdate(prevProps) {
      if (this.props.NUM_TRAINING !== prevProps.NUM_TRAINING) {
        this.fetch(this.props.NUM_TRAINING);
      }
    }
  
    render() {
      const { data, isLoading } = this.state;
  
      const { navigate } = this.props.navigation;
  
      return (
        <View style={{ height: `95%`, backgroundColor: "white" }}>
          {isLoading ? (
            
            <ActivityIndicator />
            
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <>
                  <View style={styles.imageContainer}>
                    <Text style={{ marginTop: 10 }}>{item.DESC_FR}</Text>
  
                    <TouchableOpacity
                      onPress={() => navigate("ENTRAINEMENTS", {id:item.NUM_TRAINING,title:item.TITRE_FR})}
                    >
                      <Image
                        source={{ uri: item.ILLUSTRATION }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{item.TITRE_FR},</Text>
                    <Text>{item.RECOMPENSE} points à gagner</Text>
  
                    <Text>0/{item.POINTS_DEBLOQUER} à débloquer</Text>
                  </View>
  
                  <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginTop: 10,
                    }}
                  ></View>
                </>
              )}
            />
          )}
        </View>
      );
    }
  }
  
  export default Exercices;
  
  const styles = StyleSheet.create({
    textContainer: {
      marginTop: 0,
      alignItems: "center",
      justifyContent: "center",
    },
  
    image: {
      height: 180,
      width: 300,
      marginTop: 10,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: "#ccc",
    },
  
    text: {
      fontWeight: "bold",
      fontSize: 18,
    },
  
    imageContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  });
  