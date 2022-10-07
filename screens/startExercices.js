import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import React, { Component } from "react";
import CountDown from "../components/countDown";
import Chrono from "../components/chrono";
import TimerAuto from "../components/timerAuto";


export default class StartExercices extends Component {


  constructor(props) {
    super(props);
    // console.log(this.props.route)
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
    };
  }



  // fonction qui doit remettre le compte à rebours à 30 secondes quand on appuit sur exercice suivant
  onButtonNext = () => {
    clearInterval(this.state.timerDown)
    this.setState({seconds: 30})
  // console.log('this.setState')
  this.setState({
    timerDown: null,
    minutes: '00',
    seconds: '30',
  });
  }

  
  //...............................



  //On fetch pour recuperer les donnees des entrainements
  getExerciceScenario = async () => {
    try {
      const response = await fetch(
        "https://www.zapmoove.fr/ext/zapmoove/scenarioTraining.php?NUM_TRAINING=" +
        this.state.numTraining
      );
      const json = await response.json();
      this.setState({ data: json.SCENARIO });
      // console.log(json.SCENARIO)
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
  // .................................

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
    this.setState({ currentIndex: this.state.currentIndex + 1 });
    console.log(this.state.currentIndex)
  }

  previousExo = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 });
    console.log(this.state.currentIndex)

  }


  render() {
    const { data, isLoading } = this.state;

    const { navigate } = this.props.navigation;


    // const array = ["SCENARIO"]
    // const longueur = array.length
    // console.log(longueur.length)

    // const json = new Array
    // const longueur = json.SCENARIO
    // console.log(longueur)
    

    return (

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
                <Text>Exercices: x/10</Text>
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
                // dans le render on ajoute l'index pour pouvoir l'utiliser dans la ternaire et donc afficher uniquement l'exercice courant
                renderItem={({ item, index }) => (
                  <>

                    {/* debut de la ternaire on compare l'index des elements de la flatlist par rapport a l' index courant de l'exercice en cours  */}
                    {index === this.state.currentIndex ?
                      <View>
                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={{ uri: item.GIF }}
                            style={styles.image}
                            resizeMode="contain"
                          />
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>{item.NOM_FR}</Text>
                        </View>
                        <View style={{ alignItems: "center", margin: 5 }}>
                          <Text style={{ marginTop: 10, textAlign: 'center' }}>{item.DESC_FR}</Text>
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


            <View style={{ flexDirection: "row", marginTop: 20 }}>
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
              {this.state.currentIndex === data.length -1 ?
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TouchableOpacity style={{ backgroundColor: 'green', width: 110, height: 40, borderRadius: 7, justifyContent: 'center' }}
                  // onPress={() => }
                  // onPressOut={() => }
                  >
                    <Text style={{ textAlign: 'center', color: 'white' }}>Valider l'entrainement </Text>
                  </TouchableOpacity>
                </View>
                : <View style={{ flex: 1, alignItems: "center" }}>
                  <TouchableOpacity style={{ backgroundColor: '#2196F3', width: 100, height: 40, borderRadius: 7, justifyContent: 'center' }}
                    onPress={() => this.nextExo()}
                    onPressOut={() => this.onButtonNext()}
                  >
                    <Text style={{ textAlign: 'center', color: 'white' }}>Exercice SUIVANT</Text>
                  </TouchableOpacity>
                </View>
              }


            </View>
            {/* Ternaire pour faire disparaitre le countDown si l'exercice exige des repetitions et non des secondes */}
            {data.CONDITION == "REPETITION" ? "" 
            :<CountDown />
            }
          </>
        )}

        {/* BOUTON DE VALIDATION DE L'EXERCICE: action à mettre sur le bouton 'exercice suivant' au dessus. */}

        {/* <View style={{alignItems: "center", marginTop: 30}}>
                    <TouchableOpacity style={{backgroundColor: 'grey', width: '40%', height: 30, borderRadius: 7, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center'}}>VALIDER L'EXERCICE</Text>
                    </TouchableOpacity>
                    </View> */}

        {/* BOUTON START ET PAUSE MIS DANS LE COMPONENT COUNTDOWN */}

        {/* <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity
              onPress={this.onButtonStop}
              activeOpacity={0.6}
              style={[styles.button, { backgroundColor: "#FF6F00" }]}>
              <Text style={styles.buttonText}>PAUSE</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity
              onPress={this.onButtonStart}
              activeOpacity={0.6}
              style={[
                styles.button,
                {
                  backgroundColor: this.state.startDisable ? "#B0BEC5" : "#FF6F00",
                },
              ]}
              disabled={this.state.startDisable}
            >
              <Text style={[styles.buttonText]}>START</Text>
            </TouchableOpacity>
          </View> */}

        {/* BOUTON EFFACER DU TIMER */}

        {/* <View style={{ flex: 1, alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={this.onButtonClear}
                    activeOpacity={0.6}
                    style={[
                      styles.button,
                      {
                        backgroundColor: this.state.startDisable ? "#B0BEC5" : "#FF6F00",
                      },
                    ]}
                    disabled={this.state.startDisable}>
                    <Text style={styles.buttonText}>EFFACER</Text>
                  </TouchableOpacity>
                </View> */}

        {/* </View> */}

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
    marginTop: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
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

});

