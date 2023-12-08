import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal, ScrollView } from "react-native";
import React, { Component } from "react";
import CountDown from "../components/countDown";
import TimerAuto from "../components/timerAuto";
import CountDownModal from "../components/countDownModal";
import StorageService from "../services/storageService";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class StartExercices extends Component {


  constructor(props) {
    super(props);
    // console.log(this.props)
    this.state = {
      data: [],
      isLoading: true,
      numTraining: this.props.route.params.id,
      timer: null,
      minutes_Counter: "00",
      seconds_Counter: "00",
      startDisable: false,
      // on ajoute un current index pour pouvoir y faire reference selon l'index (l'exercice en cours) du tableau (FLATLIST)
      currentIndex: 0,
      minutes: 0,
      seconds: 30,
      timerDown: null,

      modalVisible: false,
      // on cree cette variable pour savoir si on doit reset le timer du countDown ou non
      resetTimer: false,

      totalPoints: 0,
      dataGueule: []
    };
  }



  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  //On fetch pour recuperer les donnees des entrainements
  getExerciceScenario = async () => {
    try {
      const response = await fetch(
        "" +
        this.state.numTraining
      );
      const json = await response.json();
      this.setState({ data: json.SCENARIO });

      // console.log(json.SCENARIO[this.state.currentIndex]["CONDITION"])
      // console.log(json["RECOMPENSE"])

    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.getExerciceScenario();
    // console.log(this.state.currentIndex)
  }

  // TIMER............................
  onButtonStart = () => {
    let timer = setInterval(() => {
      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;

      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = "00";
      }

      this.setState({
        minutes_Counter: count.length == 1 ? "0" + count : count,
        seconds_Counter: num.length == 1 ? "0" + num : num,
      });
    }, 1000);
    this.setState({ timer });

    this.setState({ startDisable: true });
  };

  // FIN TIMER....................

  nextExo = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1, resetTimer: true });
    this.setModalVisible(true)
    console.log(this.state.currentIndex)
  }

  previousExo = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 });
    console.log(this.state.currentIndex)
  }

  closeModal = () => {
    this.setModalVisible(false)
  }

  // ici on dit au parent StartExercice de set la valeur resetTimer a false sinon elle est true tout le tps
  isTimerReset = () => {
    this.setState({ resetTimer: false })
  }

  openModal = () => {
    this.setModalVisible(true)
  }


  // ajout des points pour deverrouiller les exercices......................................................................
  async saveTraining() {
    try {
      const response = await fetch(
        ""
      );
      const json = await response.json();
      this.setState({ dataGueule: json });

      let totalPoints = 0

      try {
        totalPoints = await StorageService.load({ key: 'totalPoints' });
        console.log("GET EXERCICE", totalPoints)
      } catch (error) {
        console.log("catch de getExercices", error)
      }

      // v pour valeur
      this.state.dataGueule.forEach(v => {

        if (this.state.numTraining == v["NUM_TRAINING"]) {

          let number = parseInt(v["RECOMPENSE"])
          totalPoints += number
        }
      })
      await StorageService.save({
        key: 'totalPoints', // Note: Do not use underscore("_") in key!
        data: totalPoints,
      })
      console.log("SAVE TRAINING", totalPoints)

      this.props.navigation.navigate("CHOISIR UN ENTRAINEMENT")
      // this.setState({ totalPoints: totalPoints })
    } catch (error) {
      console.log(error);
    }
  }
  //......................................................................


  render() {
    const { data, isLoading, modalVisible } = this.state;

    const { navigate } = this.props.navigation;

    return (
      <View style={{ backgroundColor: "white", height: '100%' }}>
        <View style={{ backgroundColor: "white" }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View style={[styles.container, { flexDirection: "row" }]}>
                <View
                  style={{
                    flex: 1,
                    height: 25,
                    justifyContent: "center",
                  }}
                >
                  <Text>Exercice: {this.state.currentIndex + 1}/{data.length}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    height: 25,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Text>

                    <TimerAuto />

                  </Text>
                </View>
              </View>

              <View>
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  // dans le renderItem on ajoute l'index pour pouvoir l'utiliser dans la ternaire et donc afficher uniquement l'exercice courant
                  renderItem={({ item, index }) => (
                    <>

                      {/* debut de la ternaire on compare l'index des elements de la flatlist par rapport a l' index courant de l'exercice en cours  */}
                      {index === this.state.currentIndex ?
                        <View>
                          <View style={{ alignItems: "center", backgroundColor: "#28B570", borderRadius: 60, marginTop: 25, height: 210, margin: 10 }}>
                            <Image
                              source={{ uri: item.GIF }}
                              style={styles.image}
                              resizeMode="contain"
                            />
                          </View>
                          <View style={{ alignItems: "center" }}>
                            <Text style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold' }}>{item.NOM_FR}</Text>
                          </View>


                          <View style={{ alignItems: "center", margin: 0, height: 40 }}>
                            <ScrollView>
                              <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 15 }}>{item.DESC_FR}</Text>
                            </ScrollView>
                          </View>


                          <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }}>X {item.VALEUR} {item.CONDITION}S</Text>
                          </View>
                        </View>
                        // FIN Ternaire
                        : ""}

                    </>
                  )}
                />
              </View>


              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {/* Condition ternaire: si le current index est 0 on affiche rien sinon on affiche le bouton */}
                {this.state.currentIndex === 0 ? ""
                  : <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity style={{ backgroundColor: 'red', width: 100, height: 40, borderRadius: 7, justifyContent: 'center' }}
                      onPress={() => this.previousExo()}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>Exercice PRECEDENT</Text>
                    </TouchableOpacity>
                  </View>
                }




                {/* Dans cette ternaire on dit que si le current index est egal aux nombres de donnees du tableau on affiche le bouton "valider l'entrainement" */}
                {this.state.currentIndex === data.length - 1 ?
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity style={{ backgroundColor: 'green', width: 110, height: 40, borderRadius: 7, justifyContent: 'center' }}
                      onPress={() => this.saveTraining()}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>Valider l'entrainement </Text>
                    </TouchableOpacity>
                  </View>
                  : <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity style={{ backgroundColor: '#2196F3', width: 100, height: 40, borderRadius: 7, justifyContent: 'center' }}
                      onPress={() => this.nextExo()}

                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>Exercice SUIVANT</Text>
                    </TouchableOpacity>

                    {/* MODAL.................................................. */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>RÉCUPÉRATION</Text>
                          <Image
                            source={require("../assets/repos.jpeg")}
                            style={styles.imageModal}
                          />

                          {/* this.closModal permet d'acceder à la fonction closeModal */}
                          <CountDownModal closeModal={this.closeModal} />

                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => this.setModalVisible(!modalVisible)}
                          >
                            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Passer</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                    {/* FIN MODAL............................................ */}
                  </View>
                }
              </View>

              {/* Ternaire pour faire disparaitre le countDown si l'exercice exige des repetitions et non des secondes */}
              {/* on va chercher la donnee dans le state.data puis, on va lire le tableau pour recuperer la ligne REPETITION qui nous interesse */}
              {this.state.data[this.state.currentIndex]["CONDITION"] == 'REPETITION' ? ""

                // ici on lui passe la valeur resetTimer du parent et on lui passe la fonction isTimerReset
                : <CountDown resetTimer={this.state.resetTimer} isTimerReset={this.isTimerReset} openModal={this.openModal} />
              }
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },

  image: {
    height: 150,
    width: 300,
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 7,
    // borderWidth: 1,
    // borderColor: 'black',
  },

  button: {
    width: "80%",
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 7,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },




  imageModal: {
    height: 310,
    width: "100%",
    marginTop: 0,
    borderRadius: 7
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: -120
  },
  modalView: {
    marginTop: 235,
    backgroundColor: "white",
    borderRadius: 7,
    alignItems: "center",
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',

  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginBottom: 10
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },



});

