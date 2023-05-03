import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class EscapeRunCountDownQuestion extends Component {
  constructor(props) {
    super(props);
console.log(this.props)
    this.state = {
      timeRemaining: this.props.time,
      // timeRemaining: 5,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.getTimer, 1000);
  }

  componentWillUnmount() {
    this.setState({timeRemaining: this.props.time})
    clearInterval(this.interval);
  }

  getTimer = () => {
    if (this.state.timeRemaining > 0) {
      this.setState({
        timeRemaining: this.state.timeRemaining - 1,
      });
    } else {
      clearInterval(this.interval);

      // this.props.nextQuestion();
    }
  };

  render() {
    const { timeRemaining } = this.state;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    if (timeRemaining === 0) {
      // Le temps est écoulé, afficher la bonne réponse
      // const bonneReponse = this.props.KEY_BONNE_REPONSE;
      // const reponses = this.props.REPONSE_FR.split(";;");
      // const bonneReponseTexte = reponses[bonneReponse - 1];
      
      return (
        <View style={{marginTop: 5}}>
          {/* <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Temps écoulé</Text> */}
          <Text>{this.props.reponseFr}</Text>
        </View>
      );
    }

    return (

      <View>
        <Text style={{ fontSize: 24, fontWeight: 'bold'}}>
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </Text>
      </View>
    );
  }
}
