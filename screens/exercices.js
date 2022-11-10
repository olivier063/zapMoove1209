import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { Component } from "react";
import StorageService from "../services/storageService";

export class Exercices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      disableTraining: true,
      totalPoints: 0,
      refreshing: false,
    };
  }

  async getExercices() {
    let totalPoints = 0;
    try {
      // ici on vient chercher dans le local storage le nombre de points de l'utilisateur selon le niveau de diffiuclte de l'exercice
      totalPoints = await StorageService.load({ key: 'totalPoints' });
      console.log("GET EXERCICE", totalPoints)
    } catch (error) {
      console.log("catch de getExercices", error)
    }
    try {
      const response = await fetch(
        "https://www.zapmoove.fr/ext/zapmoove/listeTraining.php"
      );
      const json = await response.json();

      // console.log(json)

      // on cree la variable DISABLED dans le json pour le forEach
      json.forEach(v => {
        // console.log(totalPoints)
        // console.log(v["POINTS_DEBLOQUER"])
        v["DISABLED"] = totalPoints >= v["POINTS_DEBLOQUER"] ? false : true;
      })
      this.setState({ totalPoints: totalPoints, data: json })
      // console.log("APRES SET STATE",json)
      // console.log(this.state.data)

      this.opacity();

    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // OPACITY.........................................
  imageOpacity(disabled) {
    if (disabled == false) {
      return 1
    } else {
      return 0.1
    }
  }

  opacity() {
    this.state.data.forEach((v) => {
      v["OPACITY"] = this.imageOpacity(v["DISABLED"])
    })
    this.setState({ data: this.state.data })
    console.log("OPACITY",this.state.data)
  }
  //FIN OPACITY.......................................


  componentDidMount() {
    this.getExercices();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.NUM_TRAINING !== prevProps.NUM_TRAINING) {
  //     this.fetch(this.props.NUM_TRAINING);
  //   }
  // }

  // PULL TO REFRESH...................................................
  onRefresh() {
    this.setState({ refreshing: true });
    fetch("https://www.zapmoove.fr/ext/zapmoove/listeTraining.php").then(() => {
      this.setState({ refreshing: false });
    });
  }
  //FIN PULL TO REFRESH................................................

  render() {
    const { data, isLoading, totalPoints } = this.state;

    const { navigate } = this.props.navigation;


    return (
      <View style={{ height: `100%`, backgroundColor: "white" }}>
        {isLoading ? (

          <ActivityIndicator />

        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (

              <>
                <View style={styles.imageContainer}>
                  <Text style={{ marginTop: 10 }}>{item.DESC_FR}</Text>

                  <TouchableOpacity
                    onPress={() => navigate("ENTRAINEMENTS", { id: item.NUM_TRAINING, title: item.TITRE_FR })}
                    disabled={item.DISABLED}
                  >
                    <Image
                      resizeMode="contain"
                      source={{ uri: item.ILLUSTRATION }}
                      style={{
                        height: 180,
                        width: 300,
                        marginTop: 10,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: "#ccc",
                        opacity: item["OPACITY"]
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{item.TITRE_FR},</Text>
                  <Text>{item.RECOMPENSE} points à gagner</Text>
                  <Text>Il vous faut {item.POINTS_DEBLOQUER} point(s) pour débloquer l'activité</Text>
                  <Text>Nombre de points gagnés: <Text style={styles.text}>{totalPoints} </Text></Text>

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

  text: {
    fontWeight: "bold",
    fontSize: 18,
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
