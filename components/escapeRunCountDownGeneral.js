import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class EscapeRunCountDownGeneral extends Component {
  constructor(props) {
    super(props);
    console.log('PROPS COUNT GENERAL', this.props.timeRemaining);
    this.state = {
      timeRemaining: 0,
    };
  }


  getEscapeScenario = async () => {
    try {
      const response = await fetch(this.props.prop);
      const json = await response.json();
      this.setState({
        timeRemaining: json.TEMPS_MAX
      })

    } catch (error) {
      console.log(error);
    }
  }


  async componentDidMount() {
    await this.getEscapeScenario();
    if (this.state.timeRemaining > 0) {
      this.interval = setInterval(() => this.getTimer(), 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  getTimer = async () => {
    if (this.state.timeRemaining > 0) {
      this.setState({
        timeRemaining: this.state.timeRemaining - 1,
      });
    } else {
      clearInterval(this.interval);
    }
  };

  //MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE................
  // updateTimeRemaining = (isAnswerCorrect) => {
  //   const timeDiff = isAnswerCorrect ? 60 : -60;
  //   const newTimeRemaining = this.state.timeRemaining + timeDiff;
  //   this.setState({ timeRemaining: newTimeRemaining });
  // }

  checkAnswer = (answer) => {
    if (answer === this.props.correctAnswer) {
      this.props.updateTimeRemaining(this.props.timeRemaining + 60);
      // mettre à jour le timeRemaining de parent en ajoutant 60 secondes
    } else {
      this.props.updateTimeRemaining(this.props.timeRemaining - 60);
      // mettre à jour le timeRemaining de parent en retirant 60 secondes
    }
  }
  //................MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE

  render() {
    const { timeRemaining } = this.state;

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining - hours * 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
      <View>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </Text>
      </View>
    );
  }
}
