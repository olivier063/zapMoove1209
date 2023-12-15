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
import UniqueModal from "../components/uniqueModal";



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
    //quand on valide un entrainement et que l'on revient sur choisir un entrainement, on ajoute un addListener sur la navigation qui permet de recharger le getExercice
    this.props.navigation.addListener('focus', () => {
      this.getExercices();
    });
  }


  // on affiche les exercices debloqués
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
        ""
      );
      const json = await response.json();

      // console.log(json)

      // on cree la Valeure DISABLED dans le json pour le forEach
      json.forEach(v => {
        v["DISABLED"] = totalPoints >= v["POINTS_DEBLOQUER"] ? false : true;
      })
      this.setState({ totalPoints: totalPoints, data: json })

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
    // console.log("OPACITY", this.state.data)
  }
  //FIN OPACITY.......................................


  componentDidMount() {
    // console.log("COMPONENTDIDMOUNT")
    this.getExercices();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.NUM_TRAINING !== prevProps.NUM_TRAINING) {
  //     this.fetch(this.props.NUM_TRAINING);
  //   }
  // }


  // PULL TO REFRESH...................................................

  async onRefresh() {
    this.setState({ refreshing: true });
    try {
      totalPoints = await StorageService.load({ key: 'totalPoints' });
      this.setState({ totalPoints })
    } catch (error) {
      console.log("catch de onRefresh", error)
    }
    this.setState({ refreshing: false });
  };

  //FIN PULL TO REFRESH................................................

  render() {
    const { data, isLoading, totalPoints } = this.state;

    const { navigate } = this.props.navigation;


    return (
      <View style={{ height: `100%`, backgroundColor: "white" }}>
        {/* <UniqueModal /> */}

        <View style={{ marginTop: 5, alignItems: 'center' }}>
          <TouchableOpacity style={{ height: 55, width: 55, backgroundColor: '#92AFD7', borderRadius: 30, justifyContent: 'center' }}
            onPress={() => navigate('EXPLICATION DES POINTS')}
          >
            <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>?</Text>
          </TouchableOpacity>
        </View>

        {/* ce style permet d'ajouter une ligne separatrice */}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 10,
          }}
        >
        </View>


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

                {/* ce style permet d'ajouter une ligne separatrice */}
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
  createButton: {
    width: 60,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#92AFD7',
    // position: 'absolute',
    marginTop: 470,
    marginLeft: 315
  }
});
