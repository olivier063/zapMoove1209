import React, { Component } from 'react';
import { Text, View } from 'react-native';
import timerEscapeService from '../services/timerEscapeService';

export default class EscapeRunCountDownGeneral extends Component {
  constructor(props) {
    super(props);
    const timeRemaining = 0;
    this.timerEscapeService = timerEscapeService;
    this.timerEscapeService.setTimeRemaining(timeRemaining);
    this.timerEscapeService.timerChange.subscribe(state => {
      // console.log(state)
      this.setState({
        minutes: state.minutes,
        seconds: state.seconds,
        hours: state.hours,
      })
    })
    this.state = {
      // timeRemaining: 0,
      minutes: 0,
      seconds: 0,
      hours: 0,
    }
  }

  async componentDidMount() {
    const timeRemaining = await this.getEscapeScenario();
    // console.log('TATA')
    // console.log('STATE', this.state)
    if (timeRemaining > 0) {
      this.timerEscapeService.startTimer();
    }
  }

  componentWillUnmount() {
    this.timerEscapeService.stopTimer();
  }

  getEscapeScenario = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(this.props.prop);
        const json = await response.json();
        this.timerEscapeService.setTimeRemaining(json.TEMPS_MAX);
        this.timerEscapeService.setTimer();
        resolve(json.TEMPS_MAX);
      } catch (error) {
        console.log(error);
      }
    });
  }

  render() {

    const hours = this.state.hours;
    const minutes = this.state.minutes;
    const seconds = this.state.seconds;
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











