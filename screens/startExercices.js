import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import React, { Component } from "react";


export default class StartExercices extends Component {


  constructor(props) {
    super(props);
console.log(this.props.route)
    this.state = {
      data: [],
      isLoading: true,
      numTraining: this.props.route.params.id,
      timer: null,
      minutes_Counter: "00",
      seconds_Counter: "00",
      startDisable: false,
      // on ajoute un current index pour pouvoir y faire reference selon l'index (l'exercice en cours) du tableau (FLATLIST)
      currentIndex: 0
    };
  }



  //..................
  getExerciceScenario = async () => {
    try {
      const response = await fetch(
        "https://www.zapmoove.fr/ext/zapmoove/scenarioTraining.php?NUM_TRAINING=" +
        this.state.numTraining
      );
      const json = await response.json();
      this.setState({ data: json.SCENARIO });
      console.log(json)
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.getExerciceScenario();
  }

 
  // .................

  // TIMER...............
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

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

  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({ startDisable: false });
  };

  onButtonClear = () => {
    this.setState({
      timer: null,
      minutes_Counter: "00",
      seconds_Counter: "00",
    });
  };
  // FIN TIMER....................

  nextExo = () => {
    this.setState({currentIndex: this.state.currentIndex+1});
    console.log(this.state.currentIndex)
  }

  render() {
    const { data, isLoading } = this.state;

    const { navigate } = this.props.navigation;

    return (

      <View style={{ backgroundColor: "white" }}>
        <View style={[styles.container, { flexDirection: "row" }]}>
          <View
            style={{
              flex: 1,
              height: 25,
              justifyContent: "center",
            }}
          >
            <Text>Exercices: 1/10</Text>
          </View>

          <View
            style={{
              flex: 1,
              height: 25,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 23 }}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
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
            {index===this.state.currentIndex?
             <View>
                <View style={{ alignItems: "center", marginTop: 30 }}>
                  <Image
                    source={require("../assets/escape-run.jpg")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ marginTop: 30 }}>{item.NOM_FR}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ marginTop: 30 }}>DESCRIPTION DE L'EXERCICE</Text>
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
            <Text>TIMER</Text>
          </View>
          </View>
          // FIN Ternaire
            :""}

               </>
            )}
          /> 
        </View>


        <View style={{ flexDirection: "row", marginTop: 70 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity style={{ backgroundColor: 'grey', width: '80%', height: 40, borderRadius: 7, justifyContent: 'center' }}
          onPress={() => this.state.currentIndex--}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Exercice PRECEDENT</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity style={{ backgroundColor: 'grey', width: '80%', height: 40, borderRadius: 7, justifyContent: 'center'}}
            onPress={() => this.nextExo()}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Exercice SUIVANT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOUTON DE VALIDATION DE L'EXERCICE: action à mettre sur le bouton 'exercice suivant' au dessus. */}

        {/* <View style={{alignItems: "center", marginTop: 30}}>
                    <TouchableOpacity style={{backgroundColor: 'grey', width: '40%', height: 30, borderRadius: 7, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center'}}>VALIDER L'EXERCICE</Text>
                    </TouchableOpacity>
                    </View> */}

        <View style={{ flexDirection: "row", marginTop: 70 }}>
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
          </View>

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
        </View>


        {/* )} */}
        {/* />   */}

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
    height: 100,
    width: 300,
    marginTop: 40,
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
