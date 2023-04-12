import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class EscapeRunCountDownGeneral extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
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
