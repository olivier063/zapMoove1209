import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { Component } from "react";

export default class StartExercices extends Component {

  // TIMER
  constructor(props) {
    super(props);

    this.state = {
        timer: null,
        minutes_Counter: "00",
        seconds_Counter: "00",
        startDisable: false,
    };
}

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

// FIN TIMER
  
  render() {

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
            <Text style={{fontSize: 23}}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
          </View>
        </View>

        <View>
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image
              source={require("../assets/escape-run.jpg")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ marginTop: 30 }}>NOM DE L'EXERCICE</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ marginTop: 30 }}>DESCRIPTION DE L'EXERCICE</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ marginTop: 70 }}>TIMER</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 75 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity 
                    onPress={this.onButtonStop}
                    activeOpacity={0.6}
                    style={[styles.button, { backgroundColor: "#FF6F00" }]}>
                <Text style={styles.buttonText}>PAUSE</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity onPress={this.onButtonStart}
                    activeOpacity={0.6}
                    style={[
                        styles.button,
                        {
                            backgroundColor: this.state.startDisable ? "#B0BEC5" : "#FF6F00",
                        },
                    ]}
                    disabled={this.state.startDisable}
                    >
                <Text style={[styles.buttonText]}>GO</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
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
            </View>
          </View>
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
