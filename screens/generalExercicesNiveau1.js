import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { Component } from "react";


export default class GeneralExercicesNiveau1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      modalVisible: false,
      numTraining: this.props.route.params.id,
      title: this.props.route.params.title,
      video: this.props.route.params.video,
    };
  }
  //.................
  async getYoutubeVideo() {
    try {
      const response = await fetch(
        "" +
        this.state.numTraining
      );
      const json = await response.json();
      this.setState({ data: json.SCENARIO });
      // console.log("json")
    } catch (error) {
      console.log(error);
    }
  }

  // componentDidMount() {
  //   this.getYoutubeVideo();
  // }

  componentDidUpdate(prevProps) {
    if (this.props.NUM_TRAINING !== prevProps.NUM_TRAINING) {
      this.fetch(this.props.NUM_TRAINING);
    }
  }
  //......................

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  async getExerciceScenario() {
    try {
      const response = await fetch(
        "" +
        this.state.numTraining
      );
      const json = await response.json();
      this.setState({ data: json.SCENARIO });
      // console.log(json)
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.getExerciceScenario();
  }

  render() {
    const { data, isLoading, modalVisible } = this.state;
    const { navigate } = this.props.navigation;

    return (
      <View style={{ height: `95%`, backgroundColor: "white" }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}> {this.state.title} </Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <>
                  <View style={styles.container}>

                    <View style={styles.imageContainer}>
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        {item.NOM_FR}
                        {/* {this.state.title} */}
                      </Text>


                      <Text>
                        X {item.VALEUR} {item.CONDITION}
                      </Text>



                      {/* DEBUT MODAL */}

                      <View style={styles.centeredView}>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible === index}
                          onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            this.setModalVisible(!modalVisible);
                          }}
                        >
                          <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                              <Image
                                source={{ uri: item.GIF }}
                                style={styles.image}
                                resizeMode="contain"
                              />


                              <Text style={styles.modalText}>
                                {item.DESC_FR}
                              </Text>



                              <View style={{ flexDirection: "row" }}>
                                {/* permet de faire une condition en ternaire (item.VIDEO), affiche le l'image du lien youtube que si il y a un lien video dans le json */}
                                {item.VIDEO ?
                                  <View
                                    style={{ flex: 1, alignItems: "center" }}
                                  >
                                    <TouchableOpacity
                                      onPress={() => navigate("YOUTUBE", { linkYoutube: item.VIDEO })}
                                      onPressOut={() => this.setModalVisible(!modalVisible)}
                                    >
                                      <Image
                                        source={require("../assets/logoYoutube.jpeg")}
                                        style={styles.imageYoutube}
                                        resizeMode="contain"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  // les guillemets se remplace par des balise text ou autre
                                  : ""}
                                <View
                                  style={{ flex: 1, alignItems: "center" }}
                                >
                                  <Pressable
                                    style={[
                                      styles.button,
                                      styles.buttonClose,
                                    ]}
                                    onPress={() =>
                                      this.setModalVisible(!modalVisible)
                                    }
                                  >
                                    <Text style={styles.textStyle}>
                                      COMPRIS
                                    </Text>
                                  </Pressable>
                                </View>

                              </View>
                            </View>
                          </View>
                        </Modal>
                        {/* FIN MODAL */}

                        <Pressable
                          style={[styles.button, styles.buttonOpen]}
                          onPress={() => this.setModalVisible(index)}
                          onPressIn={() => this.getYoutubeVideo()}
                        >
                          <Text style={styles.textStyle}>DESCRIPTION</Text>
                        </Pressable>
                      </View>


                    </View>


                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.IMG_PRES }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </View>
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
          </>
        )}
        <View>
          <TouchableOpacity
            onPress={() => navigate("START EXERCICES", { id: this.state.numTraining })}

          >
            <Text
              style={{
                textAlign: "center",
                backgroundColor: "#0E8CEF",
                fontSize: 20,
                borderRadius: 10,
                marginLeft: 5,
                marginRight: 5,
                color: "white",
              }}
            >
              COMMENCER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    // alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },

  imageContainer: {
    backgroundColor: "white",
    width: 200,
    height: 150,
    margin: 4,
    alignItems: "center",
    marginTop: 15,
  },

  image: {
    width: 200,
    height: 150,
  },

  imageYoutube: {
    height: 40,
    width: 300,
    marginTop: -6,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    width: 100
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

});
